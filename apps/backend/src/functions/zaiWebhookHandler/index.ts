const {
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_PAY_IN_PAYMENTS,
  TABLE_PAYTO_AGREEMENT,
  TABLE_PAYMENT_ACCOUNT,
  TABLE_PAYMENT,
  TABLE_TASKS,
} = process.env;
import {
  Contact,
  Entity,
  FromToType,
  PayInPaymentStatus,
  Payment,
  PaymentStatus,
  PayoutMethod,
  PayToAgreement,
  Task,
  TaskPaymentStatus,
  TaskSearchStatus,
  TaskSignatureStatus,
  TaskStatus,
} from '/opt/API';
import {
  batchGet,
  createRecord,
  getRecord,
  queryRecords,
  updateRecord,
} from '/opt/dynamoDB';
import {
  createBpayAccount,
  CreateZaiAuthTokenResponse,
  createZaiCompany,
  createZaiItem,
  createZaiUser,
  CreateZaiUserRequest,
  getZaiUserWallet,
  initZai,
  ItemStatuses,
  makeZaiPayment,
  ZaiAccountsWebhookEvent,
  ZaiBatchTransactionsWebhookEvent,
  ZaiCompanyWebhookEvent,
  ZaiDisbursementWebhookEvent,
  ZaiItemWebhookEvent,
  ZaiPayIdsWebhookEvent,
  ZaiPaytoAgreementWebhook,
  ZaiPayToAgreementWebhookEventType,
  ZaiPaytoPaymentsWebhookEvent,
  ZaiPayToPaymentWebhookEventType,
  ZaiPayToWebhookEvent,
  ZaiTransaction,
  ZaiTransactionFailureAdviceWebhookEvent,
  ZaiTransactionWebhookEvent,
  ZaiUserWebhookEvent,
  ZaiVirtualAccountWebhookEvent,
} from '/opt/zai';
import { getBatchTransactionItem } from '/opt/zai/batchTransactions';
import { getWallet, payBpayBill } from '/opt/zai/walletAccounts';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

interface ZaiWebhookHandlerEvent {
  webhookEvent: {
    payload:
      | ZaiBatchTransactionsWebhookEvent
      | ZaiItemWebhookEvent
      | ZaiUserWebhookEvent
      | ZaiDisbursementWebhookEvent
      | ZaiTransactionWebhookEvent
      | ZaiAccountsWebhookEvent
      | ZaiCompanyWebhookEvent
      | ZaiVirtualAccountWebhookEvent
      | ZaiPayIdsWebhookEvent
      | ZaiPaytoAgreementWebhook
      | ZaiPaytoPaymentsWebhookEvent
      | ZaiTransactionFailureAdviceWebhookEvent
      | ZaiPayToWebhookEvent;
  };
}

const isUpdatedDateNewerThanExisting = (
  updatedAt: string,
  lastUpdatedAt?: string | null
) => {
  if (!lastUpdatedAt) {
    return true;
  }

  const d1 = DateTime.fromISO(updatedAt);
  const d2 = DateTime.fromISO(lastUpdatedAt);

  if (d1 < d2) {
    console.log('updatedAt is older');
  } else if (d1 === d2) {
    console.log('updatedAt is equal');
  } else {
    console.log('updatedAt is newer');
  }
  return d1 > d2;
};

// TODO: create a mapping function
// TODO: separate handler into multiple functions for each use case
//const eventHandlers = {
//  'items': handleItemsEvent,
//  'users': handleUsersEvent,
//  // Add other event handlers here
//};

const handleTransactionsEvent = async (payload: ZaiTransactionWebhookEvent) => {
  console.log('TRANSACTIONS event: ', JSON.stringify(payload));
  const transaction: ZaiTransaction = payload?.transactions;
  console.log('transaction: ', transaction);
  const accountId = transaction?.account_id;
  if (
    transaction?.type === 'deposit' &&
    transaction?.type_method === 'npp_payin' &&
    transaction?.state === 'successful'
  ) {
    console.log('NPP_PAYIN transaction: ', transaction);

    // TODO: see if necessary, can also get further transaction details?
    // Basic details - Show Transaction API
    // Additional details - Show Transaction Supplementary Data API
    let tasks: Task[] = [];

    // PAYTO pay in received
    if (transaction?.payin_details?.agreement_uuid) {
      console.log('PAYTO PAYIN');

      //const instructionId = transaction?.payin_details?.instruction_id;
      //console.log('instructionId: ', instructionId);

      // get tasks for agreement to reconcile
      try {
        const params = {
          tableName: TABLE_TASKS ?? '',
          indexName: 'tasksByAgreementUuid',
          keys: {
            agreementUuid: transaction.payin_details.agreement_uuid,
          },
        };

        tasks = await queryRecords(params);
        console.log('tasks: ', tasks);
      } catch (err) {
        console.log('ERROR query agreement tasks: ', err);
      }

      // for each task
      for (const task of tasks) {
        console.log('task: ', task);
        // query task payments pending pay to transfer
        let taskPayments;
        try {
          const params = {
            tableName: TABLE_PAYMENT ?? '',
            indexName: 'paymentsByTask',
            keys: {
              taskId: task.id,
            },
            filter: {
              status: PaymentStatus.PENDING_PAYMENT_INITIATION,
            },
          };
          taskPayments = await queryRecords(params);
          console.log('taskPayments: ', taskPayments);
        } catch (err: any) {
          console.log('ERROR getTaskPayments: ', err);
          //throw new Error(err.message);
        }

        if (!taskPayments || taskPayments.length === 0) {
          console.log(
            'could not find task payments for task to reconcile: ',
            task.id
          );
        } else {
          // calculate total amount that should have been received
          let totalAmount = 0;
          for (const taskPayment of taskPayments) {
            totalAmount += taskPayment.amount;
          }

          const isPaid =
            totalAmount !== 0 && totalAmount === transaction.amount;
          if (!isPaid) {
            console.log('UNABLE TO RECONCILE AMOUNT: ', taskPayments);
          }

          // reconcile payment
          else {
            for (const taskPayment of taskPayments) {
              totalAmount += taskPayment.amount;

              // set payment status to paid
              let updatedTaskPayment;
              try {
                updatedTaskPayment = await updateRecord(
                  TABLE_PAYMENT ?? '',
                  { id: taskPayments[0].id },
                  {
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date().toISOString(), //TODO: from transaction?
                    updatedAt: new Date().toISOString(),
                    //zaiUpdatedAt: //TODO: set this? or should we remove completely?
                  }
                );
                console.log('updatedTaskPayment: ', updatedTaskPayment);
              } catch (err: any) {
                console.log('ERROR update task payment record', err);
              }

              // if only installment, mark task as paid
              let updateTaskParams: Partial<Task> = {};
              if (
                taskPayment.installment === 1 &&
                taskPayment.installments === 1
              ) {
                updateTaskParams = {
                  ...updateTaskParams,
                  // updatedAt: new Date().toISOString(),
                  paymentStatus: TaskPaymentStatus.PAID,
                };

                // if signed, set task status as completed
                if (
                  task?.status !== TaskStatus.COMPLETED &&
                  task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
                ) {
                  updateTaskParams = {
                    ...updateTaskParams,
                    status: TaskStatus.COMPLETED,
                    fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
                    toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
                  };
                }
              }

              // For task with multiple installments, If all payments are paid, mark task as completed
              else {
                let allTaskPayments;
                try {
                  const params = {
                    tableName: TABLE_PAYMENT ?? '',
                    indexName: 'paymentsByTask',
                    keys: {
                      taskId: task.id,
                    },
                  };
                  allTaskPayments = await queryRecords(params);
                  console.log('allTaskPayments: ', allTaskPayments);
                } catch (err: any) {
                  console.log('ERROR get all task payments: ', err);
                }

                // if all paid, mark task as paid
                const allPaid =
                  allTaskPayments &&
                  allTaskPayments.every(
                    (taskPayment) =>
                      taskPayment.status === PaymentStatus.COMPLETED
                  );

                if (allPaid) {
                  updateTaskParams = {
                    ...updateTaskParams,
                    paymentStatus: TaskPaymentStatus.PAID,
                  };

                  // if signed, set task status as completed
                  if (
                    task?.status !== TaskStatus.COMPLETED &&
                    task.signatureStatus !==
                      TaskSignatureStatus.PENDING_SIGNATURE
                  ) {
                    updateTaskParams = {
                      ...updateTaskParams,
                      status: TaskStatus.COMPLETED,
                      fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
                      toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
                    };
                  }
                }
              }

              // update task if params to do so
              if (Object.entries(updateTaskParams)?.length > 0) {
                let updatedTask;
                try {
                  updatedTask = await updateRecord(
                    TABLE_TASKS ?? '',
                    { id: task.id, entityId: task.entityId },
                    updateTaskParams
                  );
                  console.log('updatedTask: ', updatedTask);
                } catch (err: any) {
                  console.log('ERROR update task record', err);
                }
              }

              // get seller for phone number - required for amex
              let sellerEntity;
              try {
                sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
                  id: taskPayment.fromId,
                });
                console.log('entityTo: ', sellerEntity);
              } catch (err: any) {
                console.log('ERROR get entity: ', err);
              }

              // create zai item to transfer funds from buyer's wallet to seller's wallet
              let zaiItem;
              try {
                const zaiItemParams = {
                  id: taskPayment.id,
                  name: `task: ${taskPayment.id}`,
                  payment_type: 2,
                  amount: taskPayment.amount,
                  currency: 'AUD',
                  buyer_id: taskPayment.buyerId,
                  seller_id: taskPayment.sellerId,
                };

                console.log('zaiItemParams: ', zaiItemParams);
                const zaiItemData = await createZaiItem(
                  zaiAuthToken?.access_token,
                  zaiItemParams
                );
                console.log('zaiItemData: ', zaiItemData);

                zaiItem = zaiItemData?.items;
              } catch (err: any) {
                console.log('ERROR createZaiItem: ', err);
              }

              //make payment for item
              if (zaiItem?.id) {
                let itemPaymentData;
                const itemPaymentParams = {
                  account_id: transaction.account_id,
                  ip_address: taskPayment.ipAddress,
                  merchant_phone: sellerEntity?.contact?.phone,
                };
                console.log('makeZaiPayment params: ', itemPaymentParams);
                try {
                  itemPaymentData = await makeZaiPayment(
                    zaiAuthToken?.access_token,
                    zaiItem.id,
                    itemPaymentParams
                  );
                  console.log('makeZaiPayment data: ', itemPaymentData);
                  zaiItem = itemPaymentData?.items;
                } catch (err: any) {
                  console.log('ERROR makeZaiPayment: ', JSON.stringify(err));
                }

                // get wallet to see if funds disbursed
                let wallet;
                try {
                  wallet = await getWallet(
                    zaiAuthToken?.access_token,
                    accountId
                  );
                  console.log('wallet: ', wallet);

                  //TODO: see if disbursed
                } catch (err: any) {
                  console.log('ERROR get wallet: ', err);
                }
              }
            }
          }
        }
      }
    }

    // PAYID pay in received
    else {
      console.log('PAYID PAYIN');
      // get TABLE_PAY_IN_PAYMENTS by zaiUserId
      let payInPaymentRecords;
      try {
        payInPaymentRecords = await queryRecords({
          tableName: TABLE_PAY_IN_PAYMENTS ?? '',
          indexName: 'payInPaymentsByZaiUser',
          keys: {
            zaiUserId: transaction?.user_id,
            status: PayInPaymentStatus.PENDING_PAYID_TRANSFER,
          },
        });
        console.log(
          'payInPaymentRecords: ',
          JSON.stringify(payInPaymentRecords)
        );
      } catch (err) {
        console.log('ERROR query pay in payments: ', err);
      }

      if (!payInPaymentRecords || payInPaymentRecords.length === 0) {
        console.log('NO PAY IN PAYMENTS TO RECONCILE FOR USER');
      }

      // get tasks for payment
      else {
        for (const payInPaymentRecord of payInPaymentRecords) {
          const keys = payInPaymentRecord?.billPayments?.map(
            ({ id }: { id: string }) => ({
              entityId: payInPaymentRecord.entityId,
              id,
            })
          );
          //if (!keys || keys.length === 0) {
          //  console.log('NO BILLS / KEYS')
          //}
          //else {
          try {
            tasks = await batchGet({
              tableName: TABLE_TASKS ?? '',
              keys,
            });

            console.log('tasks: ', tasks);
          } catch (err: any) {
            console.log('ERROR batch get tasks: ', err);
            throw new Error(err.message);
          }

          if (!tasks || tasks.length === 0) {
            console.log('NO TASKS FOUND FOR NPP PAYIN reconciliation');
          }

          // reconcile payments
          else {
            for (const task of tasks) {
              console.log('task: ', task);
              // query task payments pending pay to transfer
              let taskPayments;
              try {
                const params = {
                  tableName: TABLE_PAYMENT ?? '',
                  indexName: 'paymentsByTask',
                  keys: {
                    taskId: task.id,
                  },
                  filter: {
                    status: PaymentStatus.PENDING_PAYID_TRANSFER,
                  },
                };
                taskPayments = await queryRecords(params);
                console.log('taskPayments: ', taskPayments);
              } catch (err: any) {
                console.log('ERROR getTaskPayments: ', err);
                console.log(err.message);
              }

              if (!taskPayments || taskPayments.length === 0) {
                console.log(
                  'could not find task payments for task to reconcile: ',
                  task.id
                );
              }

              // reconcile payments
              else {
                // calculate total amount that should have been received
                let totalAmount = 0;
                for (const taskPayment of taskPayments) {
                  totalAmount += taskPayment.amount;
                }

                let isPaid = false;
                if (totalAmount !== 0 && totalAmount === transaction.amount) {
                  isPaid = true;
                }

                // get wallet to see if can be reconciled with payid payin payment
                else {
                  let wallet;
                  try {
                    wallet = await getWallet(
                      zaiAuthToken?.access_token,
                      accountId
                    );
                    console.log('wallet: ', wallet);
                  } catch (err: any) {
                    console.log('ERROR get wallet: ', err);
                  }

                  if (
                    totalAmount !== 0 &&
                    totalAmount === wallet?.wallet_accounts?.balance
                  ) {
                    isPaid = true;
                  }
                }

                if (!isPaid) {
                  console.log('UNABLE TO RECONCILE AMOUNT: ', taskPayments);
                } else {
                  for (const taskPayment of taskPayments) {
                    console.log('taskPayment: ', taskPayment);
                    // forward funds to seller
                    //let buyerId;
                    //let sellerId;
                    // payment buyer is an entity
                    //if (taskPayment.toType === FromToType.ENTITY) {
                    //  let buyerEntity;
                    //  try {
                    //    buyerEntity = await getRecord(TABLE_ENTITY ?? '', {
                    //      id: taskPayment.toId,
                    //    });
                    //    console.log('buyerEntity: ', buyerEntity);
                    //    buyerId = buyerEntity.owner;
                    //  } catch (err: any) {
                    //    console.log('ERROR get entity: ', err);
                    //  }
                    //
                    //  if (!buyerEntity) {
                    //    console.log('ERROR_GET_ENTITY_TO');
                    //  }
                    //}

                    // payment buyer is a contact
                    //else if (taskPayment.toType === FromToType.CONTACT) {
                    //  let buyerContact;
                    //  try {
                    //    buyerContact = await getRecord(TABLE_CONTACT ?? '', {
                    //      id: taskPayment.toId,
                    //    });
                    //    console.log('buyerContact: ', buyerContact);
                    //    buyerId = buyerContact.zaiUserId;
                    //  } catch (err: any) {
                    //    console.log('ERROR get contact: ', err);
                    //    //throw new Error(err.message);
                    //  }
                    //
                    //  if (!buyerContact) {
                    //    console.log('ERROR_GET_CONTACT_TO');
                    //  }
                    //}

                    // invalidate toType
                    //else {
                    //  console.log('ERROR_TO_TYPE');
                    //}

                    let sellerEntity;
                    try {
                      sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
                        id: taskPayment.fromId,
                      });
                      console.log('entityTo: ', sellerEntity);
                      //sellerId = sellerEntity.owner;
                    } catch (err: any) {
                      console.log('ERROR get entity: ', err);
                      console.log(err.message);
                    }

                    if (!sellerEntity) {
                      console.log('ERROR_GET_ENTITY_TO');
                    }

                    console.log('taskPayment: ', taskPayment);
                    // create zai item to transfer funds from buyer's wallet to seller's wallet
                    const zaiItemParams = {
                      id: taskPayment.id,
                      name: `task: ${taskPayment.id}`,
                      payment_type: 2,
                      amount: taskPayment.amount,
                      currency: 'AUD',
                      buyer_id: taskPayment.buyerId,
                      seller_id: taskPayment.sellerId,
                    };

                    console.log('zaiItemParams: ', zaiItemParams);

                    let zaiItem;
                    try {
                      const zaiItemData = await createZaiItem(
                        zaiAuthToken?.access_token,
                        zaiItemParams
                      );
                      console.log('zaiItemData: ', zaiItemData);

                      zaiItem = zaiItemData?.items;
                    } catch (err: any) {
                      console.log('ERROR createZaiItem: ', err);
                      //throw new Error(err.message);
                    }

                    //make payment for item
                    if (zaiItem?.id) {
                      let itemPaymentData;
                      const itemPaymentParams = {
                        account_id: transaction.account_id,
                        ip_address: taskPayment.ipAddress,
                        merchant_phone: sellerEntity?.contact?.phone,
                      };
                      console.log('makeZaiPayment params: ', itemPaymentParams);
                      try {
                        itemPaymentData = await makeZaiPayment(
                          zaiAuthToken?.access_token,
                          zaiItem.id,
                          itemPaymentParams
                        );
                        console.log('makeZaiPayment data: ', itemPaymentData);
                        zaiItem = itemPaymentData?.items;
                      } catch (err: any) {
                        console.log(
                          'ERROR makeZaiPayment: ',
                          JSON.stringify(err)
                        );
                      }

                      // get wallet to see if funds disbursed
                      let wallet;
                      try {
                        wallet = await getWallet(
                          zaiAuthToken?.access_token,
                          accountId
                        );
                        console.log('wallet: ', wallet);

                        //TODO: see if disbursed
                      } catch (err: any) {
                        console.log('ERROR get wallet: ', err);
                      }

                      // if disbursed funds, update payment to paid
                      if (zaiItem) {
                        // TODO: confirm if this is correct details to save if paid
                        let updatedTaskPayment;
                        try {
                          updatedTaskPayment = await updateRecord(
                            TABLE_PAYMENT ?? '',
                            { id: taskPayment.id },
                            {
                              status: ItemStatuses[zaiItem.status],
                              //zaiUpdatedAt: zaiItem.updated_at + '',
                              updatedAt: zaiItem.updated_at + '',
                              paidAt: new Date().toISOString(),
                            }
                          );
                          console.log(
                            'updatedTaskPayment: ',
                            updatedTaskPayment
                          );
                        } catch (err: any) {
                          console.log('ERROR update task payment record', err);
                        }

                        //TODO: only update if task actually paid completely?

                        const updateTaskParams = {
                          paymentStatus: TaskPaymentStatus.PAID,
                          status: TaskStatus.COMPLETED,
                          //paidAt: paidOutAt,
                          fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
                          toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
                        };

                        // if not pending signature, update status to completed
                        if (
                          task.signatureStatus !==
                          TaskSignatureStatus.PENDING_SIGNATURE
                        ) {
                          updateTaskParams.status = TaskStatus.COMPLETED;
                        }

                        try {
                          await updateRecord(
                            TABLE_TASKS ?? '',
                            { entityId: task.entityId, id: task.id },
                            {
                              ...updateTaskParams,
                              updatedAt: new Date().toISOString(),
                            }
                          );
                        } catch (err: any) {
                          console.log('ERROR update task status: ', err);
                          throw new Error(err.message);
                        }

                        // update pay_in_payment record
                        try {
                          await updateRecord(
                            TABLE_PAY_IN_PAYMENTS ?? '',
                            { id: payInPaymentRecord.id },
                            {
                              status:
                                PayInPaymentStatus.PAID_OUT_PAYID_TRANSFER,
                              updatedAt: new Date().toISOString(),
                              receivedAt: transaction.created_at,
                              paidOutAt: zaiItem.updated_at,
                            }
                          );
                        } catch (err: any) {
                          console.log(
                            'ERROR update pay in payment status: ',
                            err
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
            //}
          }
        }
      }
    }

    // With PayID, it will be different as the funds will settle into the Buyer's wallet as opposed to the Seller's wallet.
    // So you can transfer the funds to each seller's wallet only after the reconciliation.
    // You can use reference details entered by them for each payin to reconcile at your end
  } else {
    console.log('UNHANDLED transaction: ', transaction);
  }

  //let existingTransaction;
  //try {
  //  existingTransaction = await getRecord(TABLE_PAYMENT ?? '', {
  //    id
  //  });
  //
  //  console.log('existingTransaction: ', existingTransaction);
  //} catch (err) {
  //  console.log('ERROR get existing transaction: ', err);
  //}

  // updatedAt is later than existingTransaction.updatedAt

  //if (isUpdatedDateNewerThanExisting(updatedAt, existingTransaction?.updatedAt)) {
  //  //
  //
  //  try {
  //    const paymentParams = {
  //      updatedAt
  //    };
  //    console.log('paymentParams: ', paymentParams);
  //
  //    await updateRecord(TABLE_PAYMENT ?? '', { id }, paymentParams);
  //  } catch (err: any) {
  //    console.log('ERROR update payment record', err);
  //    throw new Error(err.message);
  //  }
  //
  //  // create transaction record if successful
  //  if (transaction?.state === 'successful') {
  //    const transactionParams = {
  //      id: transaction?.id,
  //    }
  //
  //    try {
  //      await createRecord(TABLE_TRANSACTION ?? '', transactionParams);
  //    } catch (err) {
  //      console.log('ERROR create transaction record', err);
  //    }
  //  }
  //}

  if (transaction?.type === 'payment') {
    //if (transaction?.type_method === 'credit_card') {
    //}
  }
};

interface PayoutDetails {
  payoutMethod: PayoutMethod;
  fromEmail?: string;
  billerCode?: string;
  reference: string;
  firstName: string;
  lastName: string;
  name: string;
  legalName: string;
  taxNumber: string;
  idOwner: string;
  idOwnerType: string;
}
const getPayoutDetails = async (
  paymentRecord: Payment
): Promise<PayoutDetails> => {
  let entityFromRecord: Entity | null = null;
  let contactFromRecord: Contact | null = null;
  const data: PayoutDetails = {
    payoutMethod: PayoutMethod.BPAY,
    fromEmail: '',
    billerCode: '',
    reference: '',
    firstName: '',
    lastName: '',
    name: '',
    legalName: '',
    taxNumber: '',
    idOwner: '',
    idOwnerType: '',
  };

  let task;
  try {
    task = await getRecord(TABLE_TASKS ?? '', {
      id: paymentRecord?.taskId,
    });
    console.log('task: ', task);
    data.reference = task.reference;
  } catch (err: any) {
    console.log('ERROR get task: ', err);
  }

  if (paymentRecord?.fromType === FromToType.ENTITY) {
    try {
      entityFromRecord = await getRecord(TABLE_ENTITY ?? '', {
        id: paymentRecord?.fromId,
      });
      console.log('entityFrom: ', entityFromRecord);
      data.fromEmail = entityFromRecord?.contact?.email ?? '';
      data.payoutMethod = entityFromRecord?.payoutMethod;
      data.firstName = entityFromRecord?.contact?.firstName ?? '';
      data.lastName = entityFromRecord?.contact?.lastName ?? '';
      data.name = entityFromRecord?.name ?? '';
      data.legalName = entityFromRecord?.legalName ?? '';
      data.taxNumber = entityFromRecord?.taxNumber ?? '';

      if (entityFromRecord?.payoutMethod === PayoutMethod.BPAY) {
        data.billerCode = entityFromRecord?.billerCode ?? '';
      }
    } catch (err: any) {
      console.log('ERROR get entity: ', err);
    }
  } else if (paymentRecord?.fromType === FromToType.CONTACT) {
    try {
      contactFromRecord = await getRecord(TABLE_CONTACT ?? '', {
        id: paymentRecord?.fromId,
      });
      console.log('contactFrom: ', contactFromRecord);

      data.fromEmail = contactFromRecord?.email ?? '';
      data.payoutMethod = contactFromRecord?.payoutMethod;
      data.firstName = contactFromRecord?.firstName ?? '';
      data.lastName = contactFromRecord?.lastName ?? '';
      data.name = contactFromRecord?.name ?? '';
      data.legalName =
        contactFromRecord?.legalName ?? contactFromRecord?.name ?? '';
      data.taxNumber = contactFromRecord?.taxNumber ?? '';

      if (entityFromRecord?.payoutMethod === PayoutMethod.BPAY) {
        data.billerCode = contactFromRecord?.billerCode ?? '';
      }
    } catch (err: any) {
      console.log('ERROR get contact: ', err);
    }
  }

  return data;
};

const handleBatchTransactionsEvent = async (
  payload: ZaiBatchTransactionsWebhookEvent
) => {
  console.log('BATCH_TRANSACTIONS event: ', JSON.stringify(payload));
  const type = payload?.batch_transactions?.type;
  const typeMethod = payload?.batch_transactions?.type_method;
  const state = payload?.batch_transactions?.state;

  let zaiBatchTransactionItem;
  try {
    const data = await getBatchTransactionItem(
      zaiAuthToken?.access_token,
      payload?.batch_transactions?.id
    );
    console.log('data: ', JSON.stringify(data));
    zaiBatchTransactionItem = data?.items?.[0];
    console.log(
      'zaiBatchTransactionItem: ',
      JSON.stringify(zaiBatchTransactionItem)
    );
  } catch (err: any) {
    console.log('ERROR get zai batch transaction item: ', err);
  }

  // direct credit payout

  // Checking the status of a direct debit / ACH payment

  // Checking the details of a disbursement for a User or Item

  // initiate a payout to a seller
  //type: payment_funding and type_method: credit_card with a status of successful. Additionally, you will also receive another callback for items with the value of released_amount equal to the value of the item amount.
  if (type === 'payment_funding') {
    if (typeMethod === 'credit_card') {
      if (state === 'successful') {
        let paymentAccount;

        // get payment record
        let paymentRecord: Payment | null = null;
        try {
          paymentRecord = await getRecord(TABLE_PAYMENT ?? '', {
            id: zaiBatchTransactionItem?.id,
          });

          console.log('paymentRecord: ', paymentRecord);
        } catch (err: any) {
          console.log('ERROR get payment: ', err);
        }

        if (!paymentRecord) {
          console.log('NO PAYMENT RECORD FOUND');
          return;
        }

        const {
          fromEmail,
          payoutMethod,
          billerCode,
          reference,
          firstName,
          lastName,
          name,
          legalName,
          taxNumber,
          idOwner,
          idOwnerType,
        } = await getPayoutDetails(paymentRecord);

        if (!fromEmail) {
          console.log('NO FROM EMAIL');
          return;
        }

        let task;
        try {
          task = await getRecord(TABLE_TASKS ?? '', {
            id: paymentRecord?.taskId,
            entityId: paymentRecord?.entityId,
          });
          console.log('task: ', task);
        } catch (err: any) {
          console.log('ERROR get task: ', err);
        }

        if (payoutMethod === PayoutMethod.BPAY) {
          const sanitisedEmail = fromEmail.replace(/\+.+@/, '@');
          const [username, domain] = sanitisedEmail.split('@');
          const zaiEmail = `${username}+${billerCode}#${task.reference}@${domain}`; // make unique email address for Zai (as email for users must be unique)
          const userId = `${billerCode}#${task.reference}`;

          // lookup BPAY account for entity To and the CRN
          let paymentAccountRecord;
          try {
            paymentAccountRecord = await queryRecords({
              tableName: TABLE_PAYMENT_ACCOUNT ?? '',
              indexName: 'paymentAccountsByBillerCodeReference',
              keys: {
                billerCode: billerCode,
                reference,
              },
            });
            console.log('paymentAccountRecord: ', paymentAccountRecord);
          } catch (err: any) {
            console.log('ERROR get payment account record: ', err);
          }

          // set seller details if exists

          if (paymentAccountRecord?.[0]) {
            // set seller details
            paymentAccount = paymentAccountRecord[0];
          } else {
            // create seller and BPAY account if it doesn't exist
            const user: CreateZaiUserRequest = {
              first_name: firstName,
              last_name: lastName,
              email: zaiEmail,
              id: userId,
              country: 'AUS',
            };
            let zaiUser;
            try {
              zaiUser = await createZaiUser(zaiAuthToken?.access_token, user);
              console.log('zai user: ', zaiUser);
            } catch (err: any) {
              console.log('ERROR create zai user: ', err);
            }

            if (zaiUser) {
              const company = {
                name: name,
                legal_name: legalName,
                tax_number: taxNumber,
                user_id: userId,
                country: 'AUS',
              };
              let zaiCompany;
              try {
                zaiCompany = await createZaiCompany(
                  zaiAuthToken?.access_token,
                  company
                );
                console.log('Zai company: ', zaiCompany);
              } catch (err: any) {
                console.log('ERROR create zai company: ', err);
              }

              let zaiUserWallet;
              try {
                zaiUserWallet = await getZaiUserWallet(
                  zaiAuthToken?.access_token,
                  zaiUser.users.id
                );
                console.log('zaiUserWallet: ', zaiUserWallet);
              } catch (err: any) {
                console.log('ERROR get zai user wallet: ', err);
              }

              let zaiBpayAccount;
              try {
                zaiBpayAccount = await createBpayAccount(
                  zaiAuthToken?.access_token,
                  {
                    user_id: zaiUser?.users.id,
                    account_name: name,
                    biller_code: billerCode,
                    bpay_crn: reference,
                  }
                );
                console.log('bpayAccount: ', zaiBpayAccount);
              } catch (err: any) {
                console.log('ERROR create bpay account: ', err);
              }

              const createdAt = DateTime.now().toISO();
              const createPaymentAccountParams = {
                id: randomUUID(),
                billerCode: billerCode,
                reference: reference,
                idOwner,
                idOwnerType,
                zaiBpayAccountId: zaiBpayAccount?.bpay_accounts?.id ?? null,
                paymentAccountType: 'BPAY', //'PaymentAccountType.BPAY',
                direction: 'PAYOUT',
                zaiUserId: zaiUser?.users.id,
                zaiCompanyId: zaiCompany?.companies?.id,
                zaiUserWalletId: zaiUserWallet?.wallet_accounts?.id ?? null,
                createdAt,
                updatedAt: createdAt,
              };
              try {
                await createRecord(
                  TABLE_PAYMENT_ACCOUNT ?? '',
                  createPaymentAccountParams
                );
              } catch (err: any) {
                console.log('ERROR create payment account: ', err);
              }
            }
            // set seller details
          }

          console.log('paymentAccount: ', paymentAccount);
          // do payout to zai seller's payment account
          let payBillData;
          const payBillParams = {
            account_id: paymentAccount?.zaiBpayAccountId,
            amount: paymentRecord?.amount,
            reference_id: reference,
          };
          console.log('payBillParams: ', payBillParams);
          try {
            payBillData = await payBpayBill(
              zaiAuthToken?.access_token,
              paymentAccount?.zaiBpayAccountId,
              payBillParams
            );
            console.log('payBillData: ', payBillData);
          } catch (err: any) {
            console.log('ERROR payBill: ', JSON.stringify(err));
          }

          // do something with payBillData.id (disbursement id)
          let updatedPaymentRecord;
          const disbursementId = payBillData?.disbursements?.id;
          try {
            updatedPaymentRecord = await updateRecord(
              TABLE_PAYMENT ?? '',
              { id: paymentRecord?.id },
              { disbursementId }
            );

            console.log('updatedPaymentRecord: ', updatedPaymentRecord);
          } catch (err: any) {
            console.log('ERROR update payment record', err);
          }

          //END BPAY PAYOUT TYPE
        } else if (payoutMethod === PayoutMethod.BANK) {
          // wallet account
          let zaiUserWallet;
          try {
            zaiUserWallet = await getZaiUserWallet(
              zaiAuthToken?.access_token,
              '' //zaiUser.users.id //TODO = enable
            );
            console.log('zaiUserWallet: ', zaiUserWallet);
          } catch (err: any) {
            console.log('ERROR get zai user wallet: ', err);
          }
        }
      } else {
        console.log('UNHANDLED payment_funding STATE: ', state);
      }
    } else {
      console.log('UNHANDLED payment_funding method: ', typeMethod);
    }
  }

  // get the entity To
  // ZAI comments - Please onboard a separate payout user for each unique CRN + Biller code. Please do not use a single user and attach CRNs to the same user.
};

const handleItemsEvent = async (payload: ZaiItemWebhookEvent) => {
  console.log('Zai ITEM event: ', payload?.items);
  const zaiItem = payload?.items;
  const paymentMethod = zaiItem.payment_method;
  const state = zaiItem.state;
  const releasedAmount = zaiItem.released_amount;
  let paymentAccount;

  let paymentRecord;
  try {
    paymentRecord = await getRecord(TABLE_PAYMENT ?? '', { id: zaiItem.id });
    console.log('paymentRecord: ', paymentRecord);
  } catch (err: any) {
    console.log('ERROR get item record: ', err);
  }

  if (!paymentRecord) {
    console.log('NO PAYMENT RECORD FOUND');
    return;
  }

  if (
    paymentMethod === 'credit card' &&
    state === 'completed' &&
    releasedAmount > 0
  ) {
    const {
      fromEmail,
      payoutMethod,
      billerCode,
      reference,
      firstName,
      lastName,
      name,
      legalName,
      taxNumber,
      idOwner,
      idOwnerType,
    } = await getPayoutDetails(paymentRecord);

    if (!fromEmail) {
      console.log('NO FROM EMAIL');
      return;
    }

    let task;
    try {
      task = await getRecord(TABLE_TASKS ?? '', {
        id: paymentRecord?.taskId,
        entityId: paymentRecord?.entityId,
      });
      console.log('task: ', task);
    } catch (err: any) {
      console.log('ERROR get task: ', err);
    }

    if (payoutMethod === PayoutMethod.BPAY) {
      const sanitisedEmail = fromEmail.replace(/\+.+@/, '@');
      const [username, domain] = sanitisedEmail.split('@');
      const zaiEmail = `${username}+${billerCode}#${task.reference}@${domain}`; // make unique email address for Zai (as email for users must be unique)
      const userId = `${billerCode}#${task.reference}`;

      // lookup BPAY account for entity To and the CRN
      let paymentAccountRecord;
      try {
        paymentAccountRecord = await queryRecords({
          tableName: TABLE_PAYMENT_ACCOUNT ?? '',
          indexName: 'paymentAccountsByBillerCodeReference',
          keys: {
            billerCode: billerCode,
            reference,
          },
        });
        console.log('paymentAccountRecord: ', paymentAccountRecord);
      } catch (err: any) {
        console.log('ERROR get payment account record: ', err);
      }

      // set seller details if exists

      if (paymentAccountRecord?.[0]) {
        // set seller details
        paymentAccount = paymentAccountRecord[0];
      } else {
        // create seller and BPAY account if it doesn't exist
        const user: CreateZaiUserRequest = {
          first_name: firstName,
          last_name: lastName,
          email: zaiEmail,
          id: userId,
          country: 'AUS',
        };
        let zaiUser;
        try {
          zaiUser = await createZaiUser(zaiAuthToken?.access_token, user);
          console.log('zai user: ', zaiUser);
        } catch (err: any) {
          console.log('ERROR create zai user: ', err);
        }

        if (zaiUser) {
          const company = {
            name: name,
            legal_name: legalName,
            tax_number: taxNumber,
            user_id: userId,
            country: 'AUS',
          };
          let zaiCompany;
          try {
            zaiCompany = await createZaiCompany(
              zaiAuthToken?.access_token,
              company
            );
            console.log('Zai company: ', zaiCompany);
          } catch (err: any) {
            console.log('ERROR create zai company: ', err);
          }

          let zaiUserWallet;
          try {
            zaiUserWallet = await getZaiUserWallet(
              zaiAuthToken?.access_token,
              zaiUser.users.id
            );
            console.log('zaiUserWallet: ', zaiUserWallet);
          } catch (err: any) {
            console.log('ERROR get zai user wallet: ', err);
          }

          let zaiBpayAccount;
          try {
            zaiBpayAccount = await createBpayAccount(
              zaiAuthToken?.access_token,
              {
                user_id: zaiUser?.users.id,
                account_name: name,
                biller_code: billerCode,
                bpay_crn: reference,
              }
            );
            console.log('bpayAccount: ', zaiBpayAccount);
          } catch (err: any) {
            console.log('ERROR create bpay account: ', err);
          }

          const createdAt = DateTime.now().toISO();
          const createPaymentAccountParams = {
            id: randomUUID(),
            billerCode: billerCode,
            reference: reference,
            idOwner,
            idOwnerType,
            zaiBpayAccountId: zaiBpayAccount?.bpay_accounts?.id ?? null,
            paymentAccountType: 'BPAY', //'PaymentAccountType.BPAY',
            direction: 'PAYOUT',
            zaiUserId: zaiUser?.users.id,
            zaiCompanyId: zaiCompany?.companies?.id,
            zaiUserWalletId: zaiUserWallet?.wallet_accounts?.id ?? null,
            createdAt,
            updatedAt: createdAt,
          };
          try {
            await createRecord(
              TABLE_PAYMENT_ACCOUNT ?? '',
              createPaymentAccountParams
            );
          } catch (err: any) {
            console.log('ERROR create payment account: ', err);
          }
        }
        // set seller details
      }

      console.log('paymentAccount: ', paymentAccount);
      // do payout to zai seller's payment account
      let payBillData;
      const payBillParams = {
        account_id: paymentAccount?.zaiBpayAccountId,
        amount: paymentRecord?.amount,
        reference_id: reference,
      };
      console.log('payBillParams: ', payBillParams);
      try {
        payBillData = await payBpayBill(
          zaiAuthToken?.access_token,
          paymentAccount?.zaiBpayAccountId,
          payBillParams
        );
        console.log('payBillData: ', payBillData);
      } catch (err: any) {
        console.log('ERROR payBill: ', JSON.stringify(err));
      }

      // do something with payBillData.id (disbursement id)
      let updatedPaymentRecord;
      const disbursementId = payBillData?.disbursements?.id;
      try {
        updatedPaymentRecord = await updateRecord(
          TABLE_PAYMENT ?? '',
          { id: paymentRecord?.id },
          { disbursementId }
        );

        console.log('updatedPaymentRecord: ', updatedPaymentRecord);
      } catch (err: any) {
        console.log('ERROR update payment record', err);
      }

      //END BPAY PAYOUT TYPE
    } else if (payoutMethod === PayoutMethod.BANK) {
      // wallet account
      let zaiUserWallet;
      try {
        zaiUserWallet = await getZaiUserWallet(
          zaiAuthToken?.access_token,
          '' //zaiUser.users.id //TODO = enable
        );
        console.log('zaiUserWallet: ', zaiUserWallet);
      } catch (err: any) {
        console.log('ERROR get zai user wallet: ', err);
      }
    }
  }

  if (
    paymentRecord &&
    isUpdatedDateNewerThanExisting(zaiItem.updated_at, paymentRecord.updatedAt)
  ) {
    console.log('Payment has newer update: ', zaiItem.updated_at);
    const paymentParams = {
      status: ItemStatuses[zaiItem.status],
      updatedAt: zaiItem.updated_at,
    };

    try {
      await updateRecord(
        TABLE_PAYMENT ?? '',
        { id: zaiItem.id },
        paymentParams
      );
    } catch (err: any) {
      console.log('ERROR update payment record', err);
    }
  }
};

const webhookEventHandler = {
  transactions: handleTransactionsEvent,
  batch_transactions: handleBatchTransactionsEvent,
  items: handleItemsEvent,
};

export const handler = async (event: ZaiWebhookHandlerEvent) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
    webhookEvent: { payload },
  } = event;

  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  // Handle 'items' webhook event
  // Triggers: Any data changes for that Item. Typically used whenever the state of the object changes.
  if ('items' in payload && payload?.items) {
    await handleItemsEvent(payload);

    // Checking that an Item has had a payment made

    // state => pending. status => 22000. Do this on createPayment or here? maybe updatedAt will be the same

    // state => completed. status => 22500. Task to paid?

    // Checking if a payment has been held

    // Checking if a payment has been refunded
  }

  // Handle 'users' webhook event
  // Triggers: Any data changes for that User. Typically used whenever the state of the object changes.
  else if ('users' in payload && payload?.users) {
    console.log('USERS event: ', payload);

    //Checking when a user’s KYC state has been approved

    //Checking if a user has been 'KYC held'
  }

  // Handle 'batch_transactions' webhook event
  // Triggers: On creation of any Batch Transactions and whenever the state changes.
  else if ('batch_transactions' in payload && payload?.batch_transactions) {
    //await handleBatchTransactionsEvent(payload);
  }

  // Handle 'accounts' webhook event
  // Triggers: When the state or enabled status of an account changes. This includes creating one and covers all types of accounts (bank, card, wallets...etc). No data can be changed on an existing account.
  // Examples: Checking if a bank account has invalid details, received after a failed disbursement
  else if ('accounts' in payload && payload?.accounts) {
    console.log('ACCOUNTS event: ', payload);
  }

  // Handle 'transactions' webhook event
  // Triggers: On creation of any Transactions and whenever the state changes.
  else if ('transactions' in payload && payload?.transactions) {
    await webhookEventHandler['transactions'](payload);
  }

  // Handle 'disbursements' webhook event
  // Triggers: On creation of any disbursement.
  else if ('disbursements' in payload && payload?.disbursements) {
    console.log('DISBURSEMENTS event: ', payload);

    // Checking that payout has been created for a seller or platform disbursement account
  }

  // Handle 'companies' webhook event
  // Triggers: On creation or change of a company.
  else if ('companies' in payload && payload?.companies) {
    console.log('COMPANIES event: ', payload);

    // Checking if a company's details have changed
  }

  // Handle 'virtual_accounts' webhook event
  // Triggers: When the virtual account status changes from pending_activation to active or pending_activation to activation_failed.
  else if ('virtual_accounts' in payload && payload?.virtual_accounts) {
    console.log('VIRTUAL_ACCOUNTS event: ', payload);

    // Checking if a virtual account's status has changed
  }

  // Handle 'pay_ids' webhook event
  // Triggers: When the PayID status changes from pending_activation to active or pending_activation to activation_failed.
  else if ('pay_ids' in payload && payload?.pay_ids) {
    console.log('PAY_IDS event: ', payload);

    //Checking if PayID status has changed
  }

  // Handle 'payto_agreements' webhook event
  // Triggers: Triggered whenever the agreement status changes.
  // Examples: This notification is triggered whenever the agreement status changes. Example - When the payer approves/rejects the agreement via their banking portal, Zai would notify you about the same.
  //TODO: does this webhook event trigger?
  else if ('payto_agreements' in payload && payload?.payto_agreements) {
    console.log('PAYTO_AGREEMENTS event: ', payload);
  }

  // Handle 'payto_payments' webhook event
  // Triggers: Triggered whenever the payment initiation request status changes.
  // Examples: This notification is triggered whenever the payment initiation request status changes. Example - when the payment initiation requested has been cleared and settled with the payer bank
  //TODO: does this webhook event trigger?
  else if ('payto_payments' in payload && payload?.payto_payments) {
    console.log('PAYTO_PAYMENTS event: ', payload);
  }

  // Handle 'transaction_failure_advice' webhook event
  // Triggers: Triggered whenever funds have been debited from the payer's bank account, however, failed to be matched with the payer's digital wallet in Zai.
  // Examples: This notification is triggered whenever reconciliation of funds (received via PayTo) fails on user's wallet.
  else if (
    'transaction_failure_advice' in payload &&
    payload?.transaction_failure_advice
  ) {
    console.log('TRANSACTION_FAILURE_ADVICE event: ', payload);

    // when the user is in held status in Zai due to any reason
  } else if ('event_type' in payload) {
    // Payment initiation request has completed - funds have been collected from debtor's account
    if (
      payload.event_type ===
      ZaiPayToPaymentWebhookEventType.PAYMENT_INITIATION_COMPLETED
    ) {
      // reconcile payment and potentially task occurs with transaction
      // TODO anything to do here?
      /*
       {
       "webhookEvent": {
       "payload": {
       "event_type": "PAYMENT_INITIATION_COMPLETED",
       "id": "f635e084-a9dd-4fa5-a1de-a1ac03063fe0",
       "original_request": {
       "priority": "UNATTENDED",
       "payment_info": {
       "instructed_amount": "95064",
       "last_payment": false
       }
       },
       "data": {
       "payment_request_uuid": "f635e084-a9dd-4fa5-a1de-a1ac03063fe0",
       "instruction_id": "PRTYAU31XXXI20240426000000000092340",
       "agreement_uuid": "77b463ec-aa23-4427-84a3-86e3b9a42485",
       "agreement_id": "38efd340036b11ef9cfb93cb0abf1f4f",
       "status": "PAYMENT_INITIATION_COMPLETED",
       "status_description": "Payment initiation request has completed - funds have been collected from debtor's account",
       "payment_reconciled": null,
       "created_at": "2024-04-26 01:21:34.445249",
       "updated_at": "2024-04-26 01:21:37.428646",
       "payment_info": {
       "instruction_id": "PRTYAU31XXXI20240426000000000092340",
       "instructed_amount": "95064",
       "last_payment": false
       }
       },
       "message": "SUCCESSFUL"
       }
       }
       }
       */
    }

    // Agreement updates
    else {
      let updatePayToAgreementParams: Partial<PayToAgreement> = {
        status: payload.data.status,
        updatedAt: new Date().toISOString(),
      };
      // PayTo agreement created
      //if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_CREATION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_ACTIVATION_SUCCESS) {
      //}

      // PayTo agreement rejection
      if (
        payload.event_type ===
        ZaiPayToAgreementWebhookEventType.AGREEMENT_REJECTION_SUCCESS
      ) {
        updatePayToAgreementParams = {
          ...updatePayToAgreementParams,
          statusDescription: payload.data.status_description,
          statusReasonCode: payload.data.status_reason_code,
          statusReasonDescription: payload.data.status_reason_description,
        };
      }

      // paytopayment failed
      if (
        payload.event_type ===
        ZaiPayToPaymentWebhookEventType.PAYMENT_INITIATION_REJECTED
      ) {
        updatePayToAgreementParams = {
          ...updatePayToAgreementParams,
          statusDescription: payload.data.status_description,
          statusReasonCode: payload.data.status_reason_code,
          statusReasonDescription: payload.data.status_reason_description,
        };
      }

      //Payer fails to respond to the agreement authorisation request
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_EXPIRATION_SUCCESS) {
      //}

      // Payer fails to respond to the agreement authorisation request
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_PAUSE_SUCCESS) {
      //}

      // Agreement status change success
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RESUME_SUCCESS) {
      //}

      //Agreement status change succes
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_CANCELLATION_SUCCESS) {
      //}

      //Unilateral amendment success
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_REJECTION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_EXPIRATION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RECALL_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RECALL_REJECTED) {
      //}

      // TODO: updatedAt / ensure not overwriting newer changes.
      if (payload?.data?.agreement_uuid) {
        let updatedPayToAgreementRecord;
        try {
          updatedPayToAgreementRecord = await updateRecord(
            TABLE_PAYTO_AGREEMENT ?? '',
            {
              id: payload.data.agreement_uuid,
            },
            updatePayToAgreementParams
          );

          console.log(
            'updatedPayToAgreementRecord: ',
            updatedPayToAgreementRecord
          );
        } catch (err: any) {
          console.log('ERROR updateRecord: ', err);
        }
      }
    }
  }

  // unhandled webhook event
  else {
    console.log('UNHANDLED WEBHOOK EVENT: ', JSON.stringify(payload));
  }
};
