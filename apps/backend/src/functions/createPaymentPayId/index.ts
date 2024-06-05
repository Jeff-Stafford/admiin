const {
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  TABLE_PAY_IN_PAYMENTS,
  TABLE_PAYMENT,
  TABLE_PAYMENT_METHODS,
  TABLE_TASKS,
} = process.env;
import {
  AccountDirection,
  BillsPaymentInput,
  CreatePaymentPayIdInput,
  PayInPayment,
  PayInPaymentStatus,
  Payment,
  PaymentMethodStatus,
  PaymentMethodType,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskStatus,
} from '/opt/API';
import {
  batchGet,
  batchPut,
  createRecord,
  getRecord,
  queryRecords,
  updateRecord,
} from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  getZaiUserWallet,
  GetZaiUserWalletResponse,
  initZai,
  ItemStatuses,
  makeZaiPayment,
  validateBills,
  validateEntityUser,
  validateEntityTo,
  getPaymentFromToData,
  getTaskStatus,
  getTaskSearchStatus,
} from '/opt/zai';
import { getWallet } from '/opt/zai/walletAccounts';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import {
  getScheduledAtStatus,
  getTaskPaymentAmount,
  getTaskPaymentGstAmount,
} from '/opt/payment';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (
  ctx,
  _check1,
  _check2
) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  console.log('_check1: ', JSON.stringify(_check1)); //TODO: remove once implement unit tests
  console.log('_check2: ', JSON.stringify(_check2)); //TODO: remove once implement unit tests
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { entityId, billPayments } = input as CreatePaymentPayIdInput; // CreatePaymentPayIdInput
  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;
  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // get entity user to ensure they have permission to update the entity
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // get entity paying the bills / tasks
  let entityPayer;
  try {
    entityPayer = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entityPayer: ', err);
    throw new Error(err.message);
  }

  console.log('entityPayer: ', entityPayer);
  validateEntityTo(entityPayer);

  // get all the tasks for payment
  let tasks: Task[] = [];
  const keys = billPayments.map(({ id }: { id: string }) => ({ entityId, id }));
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

  validateBills(tasks, billPayments, entityId);

  // get the user wallet to see if funds have arrived
  let zaiUserWallet: GetZaiUserWalletResponse | null = null;
  try {
    zaiUserWallet = await getZaiUserWallet(
      zaiAuthToken?.access_token,
      entityPayer.owner
    );
    console.log('zaiUserWallet: ', zaiUserWallet);
  } catch (err: any) {
    console.log('ERROR get zai user wallet: ', err);
    throw new Error(err.message);
  }

  if (!zaiUserWallet) {
    throw new Error('NO_WALLET_ACCOUNT');
  }

  // calculate total amount to be received for payId transfer
  let totalAmount = 0;
  tasks.forEach((task: Task) => {
    const billPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );

    if (!billPayment || !task.amount) {
      throw new Error(`INVALID_BILL_PAYMENT`);
    }

    // calculate total based on non-scheduled payments
    if (billPayment.paymentType !== PaymentType.SCHEDULED) {
      const amount = getTaskPaymentAmount({
        amount: task.amount,
        installments: billPayment.installments,
        isFirstInstallment: true,
        isTaxBill: false, //TODO: payid has been parked, need to handle tax bills if we-activated
      });

      totalAmount += amount;
    }
  });

  // TODO: handle if all billPayments are scheduled payments

  if (totalAmount === 0) {
    throw new Error('NO_AMOUNT_PAYABLE');
  }

  console.log('Total amount to be received by PayID for bills: ', totalAmount);
  let isPaid = false;
  // check if user has paid based on exact match of funds in wallet
  if (totalAmount === zaiUserWallet?.wallet_accounts?.balance) {
    isPaid = true;
  }

  // TODO: or wallet contains enough funds? - Perhaps requires approval from Admiin
  // wallet contains enough funds?
  else if (totalAmount < zaiUserWallet?.wallet_accounts?.balance) {
    //isPaid = true;
  }

  let paidOutAt;

  const requests: Promise<any>[] = [];
  const payInPaymentId = randomUUID();

  for (let i = 0; i < tasks.length; i++) {
    const futurePayments = [];
    const task = tasks[i];
    const taskPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );
    let payment: Payment;
    let updateTaskParams: Partial<Task> | null = null;

    // prevents TS issues, validation occurs in validateBills
    if (!taskPayment || !task || !task.amount) {
      throw new Error(`INVALID_BILL_PAYMENT`);
    }

    // get amount expected for this task payment
    const amount = getTaskPaymentAmount({
      amount: task.amount,
      installments: taskPayment.installments,
      isFirstInstallment: true,
      isTaxBill: false, //TODO: payid has been parked, need to handle tax bills if we-activated
    });

    const { buyerId, sellerId, sellerPhone } = await getPaymentFromToData(task);

    //// payer / buyer is an entity
    //let buyerId;
    //let sellerId;
    //if (task.toType === FromToType.ENTITY) {
    //  let buyerEntity;
    //  try {
    //    buyerEntity = await getRecord(TABLE_ENTITY ?? '', {
    //      id: task.toId,
    //    });
    //    console.log('buyerEntity: ', buyerEntity);
    //    buyerId = buyerEntity.owner;
    //  } catch (err: any) {
    //    console.log('ERROR get entity: ', err);
    //    throw new Error(err.message);
    //  }
    //
    //  if (!buyerEntity) {
    //    throw new Error('ERROR_GET_ENTITY_TO');
    //  }
    //}
    //
    //// payer / buyer is a contact
    //else if (task.toType === FromToType.CONTACT) {
    //  let buyerContact;
    //  try {
    //    buyerContact = await getRecord(TABLE_CONTACT ?? '', {
    //      id: task.toId,
    //    });
    //    console.log('buyerContact: ', buyerContact);
    //    buyerId = buyerContact.zaiUserId;
    //  } catch (err: any) {
    //    console.log('ERROR get contact: ', err);
    //    throw new Error(err.message);
    //  }
    //
    //  if (!buyerContact) {
    //    throw new Error('ERROR_GET_CONTACT_TO');
    //  }
    //}
    //
    //// get the seller / payee entity
    //let sellerEntity;
    //try {
    //  sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
    //    id: task.fromId,
    //  });
    //  console.log('sellerEntity: ', sellerEntity);
    //  sellerId = sellerEntity.owner;
    //} catch (err: any) {
    //  console.log('ERROR get entity: ', err);
    //  throw new Error(err.message);
    //}

    const createdAt = new Date().toISOString();

    // scheduled payment - take payment in future. No money will be taken now with Pay ID
    if (taskPayment.paymentType === PaymentType.SCHEDULED) {
      payment = {
        id: task.id,
        taskId: task.id,
        entityId,
        amount,
        gstAmount: getTaskPaymentGstAmount({
          amount: task.amount,
          installments: taskPayment.installments,
          isFirstInstallment: true,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        status: getScheduledAtStatus({
          amount,
          scheduledAt: taskPayment.scheduledAt,
        }),
        installment: 1,
        installments: taskPayment.installments,
        paymentType: taskPayment.paymentType,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        buyerId,
        sellerId,
        createdAt,
        updatedAt: createdAt,
        scheduledAt: taskPayment.scheduledAt,
        __typename: 'Payment',
      };

      // update task to scheduled
      updateTaskParams = {
        paymentStatus: TaskPaymentStatus.SCHEDULED,
        status: TaskStatus.SCHEDULED,
      };
    }

    // reconcile payment for pay now / installments
    else {
      payment = {
        id: task.id,
        taskId: task.id,
        entityId,
        amount,
        gstAmount: getTaskPaymentGstAmount({
          amount: task.amount,
          installments: taskPayment.installments,
          isFirstInstallment: true,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        status: getScheduledAtStatus({
          amount,
          scheduledAt: taskPayment.scheduledAt,
        }),
        installment: 1,
        installments: taskPayment.installments,
        paymentType: taskPayment.paymentType,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        buyerId,
        sellerId,
        createdAt,
        updatedAt: createdAt,
        scheduledAt: taskPayment.scheduledAt,
        __typename: 'Payment',
      };

      // money received, create received payment and reconcile transactions
      if (isPaid) {
        payment.status = PaymentStatus.RECEIVED_PAYID_TRANSFER;
        payment.receivedAt = createdAt; //TODO: should this be from the zai wallet funding event?

        // create zai item to transfer funds from buyer's wallet to seller's wallet
        const zaiItemParams = {
          id: taskPayment.id,
          name: `task: ${taskPayment.id}`,
          payment_type: 2,
          amount: getTaskPaymentAmount({
            amount: task.amount,
            installments: taskPayment.installments,
            isFirstInstallment: false,
            isTaxBill: false, //TODO: payid has been parked, need to handle tax bills if we-activated
          }),
          gstAmount: getTaskPaymentGstAmount({
            amount: task.amount,
            installments: taskPayment.installments,
            isFirstInstallment: false,
            isTaxBill: false,
            gstInclusive: task.gstInclusive ?? false,
          }),
          currency: 'AUD',
          buyer_id: buyerId,
          seller_id: sellerId,
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
          throw new Error(err.message);
        }

        // make payment for item
        if (zaiItem?.id) {
          let itemPaymentData;
          const itemPaymentParams = {
            account_id: zaiUserWallet.wallet_accounts.id,
            ip_address: ip,
            merchant_phone: sellerPhone,
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
            throw new Error(err.message);
          }

          // get wallet to see if funds disbursed
          let zaiUserUpdatedWallet;
          try {
            zaiUserUpdatedWallet = await getWallet(
              zaiAuthToken?.access_token,
              zaiUserWallet.wallet_accounts.id
            );
            console.log('updatedWallet: ', zaiUserUpdatedWallet);
            //TODO: see if disbursed

            if (
              zaiUserUpdatedWallet?.wallet_accounts?.balance ===
              zaiUserWallet?.wallet_accounts?.balance - totalAmount
            ) {
              paidOutAt = new Date().toISOString();
            }
          } catch (err: any) {
            console.log('ERROR get updatedWallet: ', err);
            throw new Error(err.message);
          }

          // if disbursed funds, update payment to paid
          if (zaiItem) {
            // TODO: confirm if this is correct details to save if paid
            let updatedTaskPayment;
            paidOutAt = new Date().toISOString();
            try {
              updatedTaskPayment = await updateRecord(
                TABLE_PAYMENT ?? '',
                { id: taskPayment.id },
                {
                  status: ItemStatuses[zaiItem.status],
                  //zaiUpdatedAt: zaiItem.updated_at + '',
                  updatedAt: zaiItem.updated_at + '',
                  paidOutAt,
                  paidAt: paidOutAt, // TODO: is this correct?
                }
              );
              console.log('updatedTaskPayment: ', updatedTaskPayment);
            } catch (err: any) {
              console.log('ERROR update task payment record', err);
              throw new Error(err.message);
            }

            //TODO: only update if task actually paid completely?
            updateTaskParams = {
              paymentStatus: TaskPaymentStatus.PAID,
              //status: TaskStatus.COMPLETED,
              //paidAt: paidOutAt,
              //fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
              //toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
            };

            // if not pending signature, update status to completed
            //if (
            //  task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
            //) {
            //  updateTaskParams.status = TaskStatus.COMPLETED;
            //}

            const newTaskStatus = getTaskStatus({
              signatureStatus: task.signatureStatus,
              paymentStatus: TaskPaymentStatus.PAID,
            });
            if (task.status !== newTaskStatus) {
              const searchStatus = getTaskSearchStatus({
                status: newTaskStatus,
                signatureStatus: task.signatureStatus,
                paymentStatus: TaskPaymentStatus.PAID,
              });
              updateTaskParams.status = newTaskStatus;
              updateTaskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
              updateTaskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
            }
          }
        }
      }

      // money pending transfer, create pending payment
      else {
        payment.status = PaymentStatus.PENDING_PAYID_TRANSFER;
        updateTaskParams = {
          paymentStatus: TaskPaymentStatus.PENDING_PAYID_TRANSFER,
          status: TaskStatus.SCHEDULED,
        };
      }
    }

    requests.push(createRecord(TABLE_PAYMENT ?? '', payment));

    if (updateTaskParams) {
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
    }

    // create installments for future payments
    for (let j = 1; j < (taskPayment.installments ?? 1); j++) {
      const nextScheduledAt = DateTime.fromFormat(
        task.dueAt ?? '',
        'yyyy-MM-dd'
      )
        .plus({ months: j })
        .toFormat('yyyy-MM-dd');
      // create installment
      const createdAt = new Date().toISOString();
      const installment: Payment = {
        id: randomUUID(),
        entityId: task.entityId,
        taskId: task.id,
        paymentType: PaymentType.INSTALLMENTS,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        amount: getTaskPaymentAmount({
          amount: task.amount,
          installments: taskPayment.installments,
          isFirstInstallment: false,
          isTaxBill: false, //TODO: payid has been parked, need to handle tax bills if we-activated
        }),
        gstAmount: getTaskPaymentGstAmount({
          amount: task.amount,
          installments: taskPayment.installments,
          isFirstInstallment: false,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        status: getScheduledAtStatus({ amount, scheduledAt: nextScheduledAt }),
        scheduledAt: nextScheduledAt,
        installment: j + 1,
        installments: taskPayment.installments,
        createdAt,
        buyerId,
        sellerId,
        updatedAt: createdAt,
        __typename: 'Payment',
      };

      futurePayments.push(installment);
    }

    if (futurePayments.length > 0) {
      try {
        await batchPut({
          tableName: TABLE_PAYMENT ?? '',
          items: futurePayments,
        });
      } catch (err: any) {
        console.log('ERROR batch put installments: ', err);
        throw new Error(err.message);
      }
    }
  }

  const createdAt = new Date().toISOString();
  const payInPaymentRecord: PayInPayment = {
    id: payInPaymentId,
    entityId,
    amount: totalAmount,
    //TODO: can the setting of this status be improved? Also set as reusable variable?
    status: isPaid
      ? PayInPaymentStatus.PAID_OUT_PAYID_TRANSFER
      : PayInPaymentStatus.PENDING_PAYID_TRANSFER,
    zaiUserId: entityPayer.owner,
    taskPayments: billPayments.map((billPayment) => ({
      ...billPayment,
      __typename: 'TaskPayment',
    })),
    createdBy: sub,
    createdAt,
    updatedAt: createdAt,
    __typename: 'PayInPayment',
  };

  // TODO: receivedAt set as transaction time? as user paid prior to this
  if (paidOutAt) {
    payInPaymentRecord.receivedAt = paidOutAt;
    payInPaymentRecord.paidOutAt = paidOutAt;
  }

  requests.unshift(
    createRecord(TABLE_PAY_IN_PAYMENTS ?? '', payInPaymentRecord)
  );

  // query payment methods to see if payId exists by entity and filter
  let payIdPaymentMethod;
  try {
    payIdPaymentMethod = await queryRecords({
      tableName: TABLE_PAYMENT_METHODS ?? '',
      keys: {
        entityId,
      },
      filter: {
        paymentMethodType: PaymentMethodType.PAYID,
      },
      indexName: 'paymentMethodsByEntity',
    });
    console.log('payIdPaymentMethod: ', payIdPaymentMethod);
  } catch (err: any) {
    console.log('ERROR get payId payment method: ', err);
    throw new Error(err.message);
  }

  if (!payIdPaymentMethod || payIdPaymentMethod.length === 0) {
    const paymentMethod = {
      id: randomUUID(),
      paymentMethodType: PaymentMethodType.PAYID,
      //type: String
      //fullName: String
      //number: String
      //expMonth: String
      //expYear: String
      //accountName: String
      //bankName: String
      //accountNumber: String
      //routingNumber: String
      //holderType: String
      //accountType: String
      entityId,
      status: PaymentMethodStatus.ACTIVE,
      accountDirection: AccountDirection.PAYMENT,
      //expiresAt: AWSDateTime
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
    };
    requests.push(createRecord(TABLE_PAYMENT_METHODS ?? '', paymentMethod));
  }

  try {
    const response = await Promise.all(requests);
    console.log('response: ', response);

    const [payInPayment] = response;
    console.log('payInPayment: ', payInPayment);
    return payInPayment;
  } catch (err: any) {
    console.log('ERROR Promise.all: ', err);
    throw new Error(err.message);
  }
};
