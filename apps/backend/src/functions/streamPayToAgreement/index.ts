const {
  TABLE_PAYMENT,
  TABLE_PAYTO_AGREEMENT,
  TABLE_PAYMENT_METHODS,
  TABLE_TASKS,
} = process.env;
import {
  AccountDirection,
  Payment,
  PaymentMethodStatus,
  PaymentMethodType,
  PaymentStatus,
  Task,
  TaskPaymentStatus,
} from '/opt/API';
import { isPastDate, isTodayDate } from '/opt/dates';
import {
  createRecord,
  deleteRecord,
  getRecord,
  queryRecords,
  updateRecord,
} from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  initiatePayToPayment,
  InitiatePayToPaymentRequest,
  initZai,
} from '/opt/zai';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { getScheduledAtStatus } from '/opt/payment';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

// TODO: types in this file
// TODO: agreement type with hidden backend / zai fields
//const queryAgreementTasks = async (agreementUuid: string): Promise<any> => {
//  let nextToken = undefined;
//  let allItems: Record<string, any>[] = [];
//
//  do {
//    const params = {
//      TableName: TABLE_TASKS,
//      IndexName: 'tasksByAgreementUuid',
//      KeyConditionExpression: '#agreementUuid = :agreementUuid',
//      ExpressionAttributeNames: {
//        '#agreementUuid': 'agreementUuid'
//      },
//      ExpressionAttributeValues: {
//        ':agreementUuid': agreementUuid
//      },
//      ExclusiveStartKey: nextToken
//    };
//
//    const command: QueryCommand = new QueryCommand(params);
//    const data = await docClient.send(command);
//    if (data.Items) {
//      allItems = [...allItems, ...data.Items];
//    }
//    nextToken = data.LastEvaluatedKey;
//  } while (nextToken);
//
//  return allItems;
//};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // RECORD CREATED
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      //const agreement = unmarshall(
      //  data.dynamodb.NewImage as { [key: string]: AttributeValue }
      //);
    }

    // RECORD UPDATED
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newAgreement = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldAgreement = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );
      console.log('newAgreement: ', newAgreement);
      console.log('oldAgreement: ', oldAgreement);

      // agreement has been denied / cancelled, change task back to pending payment and delete payments so user can respecify payment
      if (
        oldAgreement.status !== 'CANCELLED' &&
        newAgreement.status === 'CANCELLED'
      ) {
        let tasks;
        try {
          tasks = await queryRecords({
            tableName: TABLE_TASKS ?? '',
            keys: {
              agreementUuid: newAgreement.agreementUuid,
            },
            indexName: 'tasksByAgreementUuid',
          });
          console.log('tasks: ', tasks);
        } catch (err) {
          console.log('ERROR query agreement tasks: ', err);
        }

        if (tasks) {
          for (const task of tasks) {
            console.log('task: ', task);
            // change agreement tasks back to pending payment
            let updatedTask;
            try {
              updatedTask = await updateRecord(
                TABLE_TASKS ?? '',
                { id: task.id, entityId: task.entityId },
                { paymentStatus: TaskPaymentStatus.PENDING_PAYMENT }
              );

              console.log('updatedTask: ', updatedTask);
            } catch (err: any) {
              console.log('ERROR update task record', err);
            }

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
                  status: PaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION,
                },
              };
              taskPayments = await queryRecords(params);
              console.log('taskPayments: ', taskPayments);
            } catch (err: any) {
              console.log('ERROR getTaskPayments: ', err);
              throw new Error(err.message);
            }

            // delete agreement payments created
            if (taskPayments?.length > 0) {
              for (const taskPayment of taskPayments) {
                console.log('taskPayment: ', taskPayment);
                let deletedRecord;
                try {
                  deletedRecord = await deleteRecord(TABLE_PAYMENT ?? '', {
                    id: taskPayment.id,
                  });

                  console.log('updatedPaymentRecord: ', deletedRecord);
                } catch (err: any) {
                  console.log('ERROR update payment record', err);
                }
              }
            }
          }
        }
      }

      // agreement has been created and become active, now we can take payment
      else if (
        oldAgreement.status === 'CREATED' &&
        newAgreement.status === 'ACTIVE'
      ) {
        // Payer approved the agreement, take payment. Note this may need to change, potentially if agreement can be for multiple tasks
        console.log('INITIATING PAYMENT FOR AGREEMENTS TASK(S)');
        let payToAgreementRecord;
        try {
          payToAgreementRecord = await getRecord(TABLE_PAYTO_AGREEMENT ?? '', {
            id: newAgreement.agreementUuid,
          });
          console.log('payToAgreementRecord: ', payToAgreementRecord);
        } catch (err: any) {
          console.log('ERROR getPayToAgreement: ', err);
        }

        if (payToAgreementRecord.agreementUuid) {
          // query tasks for the agreement
          let tasks: Task[] = [];
          try {
            tasks = await queryRecords({
              tableName: TABLE_TASKS ?? '',
              keys: {
                agreementUuid: newAgreement.agreementUuid,
              },
              indexName: 'tasksByAgreementUuid',
            });
            console.log('tasks: ', tasks);
          } catch (err) {
            console.log('ERROR query agreement tasks: ', err);
          }

          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            // query all payments for the task that are payto pending
            let taskPayments: Payment[] = [];
            try {
              const params = {
                tableName: TABLE_PAYMENT ?? '',
                indexName: 'paymentsByTask',
                keys: {
                  taskId: task.id,
                },
                filter: {
                  status: PaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION,
                },
              };
              taskPayments = await queryRecords(params);
              console.log('taskPayments: ', taskPayments);
            } catch (err: any) {
              console.log('ERROR getTaskPayments: ', err);
            }

            if (taskPayments.length > 0) {
              for (let j = 0; j < taskPayments.length; j++) {
                const taskPayment = taskPayments[j];
                console.log('taskPayment: ', taskPayment);

                // take payment as already due to be deducted
                if (
                  taskPayment.scheduledAt &&
                  (isTodayDate(taskPayment.scheduledAt) ||
                    isPastDate(taskPayment.scheduledAt))
                ) {
                  // initiate pay to payment
                  const params: InitiatePayToPaymentRequest = {
                    priority: 'UNATTENDED',
                    payment_info: {
                      instructed_amount: taskPayment?.amount?.toString() ?? '',
                      last_payment: false, //TODO: need to figure if last payment, for example payment.installment === payment.installments. However, doesn't factor outstanding payments
                      //end_to_end_id: task.id, //TODO: is limited to 32 chars. uuid is 36. Generate a unique id for task(s)?
                      remittance_info: task.noteForOther ?? undefined,
                    },
                  };

                  // initiate pay to payment to collect funds from payer's account for agreement / task
                  let payToPayment;
                  try {
                    payToPayment = await initiatePayToPayment(
                      zaiAuthToken?.access_token,
                      task.agreementUuid ?? '',
                      params
                    );
                    console.log('paytoPayment: ', payToPayment);
                  } catch (err: any) {
                    console.log('ERROR createPayToAgreement: ', err);
                    //throw new Error(err.message);
                  }

                  // payment collection has been initiated pending processing
                  if (
                    payToPayment?.status ===
                    PaymentStatus.PENDING_PAYMENT_INITIATION
                  ) {
                    // update payment record status
                    const updatedPaymentParams = {
                      status: PaymentStatus.PENDING_PAYMENT_INITIATION,
                      paymentRequestUuid: payToPayment.payment_request_uuid,
                      instructionId: payToPayment.instruction_id,
                      updatedAt: new Date().toISOString(),
                    };

                    try {
                      const updatedPayment = await updateRecord(
                        TABLE_PAYMENT ?? '',
                        { id: taskPayment.id },
                        updatedPaymentParams
                      );
                      console.log('Updated payment record: ', updatedPayment);
                    } catch (err: any) {
                      console.log('ERROR getPayment: ', err);
                      //throw new Error(err.message);
                    }

                    // update task to scheduled
                    let updatedTask;
                    try {
                      updatedTask = await updateRecord(
                        TABLE_TASKS ?? '',
                        { id: task.id, entityId: task.entityId },
                        { paymentStatus: TaskPaymentStatus.SCHEDULED }
                      );

                      console.log('updatedTask: ', updatedTask);
                    } catch (err: any) {
                      console.log('ERROR update task record', err);
                    }

                    // query payment methods to see if payId exists by entity and filter
                    let payToPaymentMethod;
                    try {
                      payToPaymentMethod = await queryRecords({
                        tableName: TABLE_PAYMENT_METHODS ?? '',
                        keys: {
                          entityId: task.entityId,
                        },
                        filter: {
                          paymentMethodType: PaymentMethodType.PAYTO,
                        },
                        indexName: 'paymentMethodsByEntity',
                      });

                      console.log('payToPaymentMethod: ', payToPaymentMethod);
                    } catch (err: any) {
                      console.log('ERROR get payId payment method: ', err);
                    }

                    if (
                      !payToPaymentMethod ||
                      payToPaymentMethod.length === 0
                    ) {
                      console.log('Create payto payment method');
                      const createdAt = new Date().toISOString();
                      const paymentMethod = {
                        id: randomUUID(),
                        paymentMethodType: PaymentMethodType.PAYTO,
                        status: PaymentMethodStatus.ACTIVE,
                        accountDirection: AccountDirection.PAYMENT,
                        entityId: task.entityId,
                        //TODO: bank / bsb ??
                        //TODO: created by?
                        createdAt,
                        updatedAt: createdAt,
                      };
                      try {
                        await createRecord(
                          TABLE_PAYMENT_METHODS ?? '',
                          paymentMethod
                        );
                      } catch (err: any) {
                        console.log('ERROR create PayTO payment method: ', err);
                        throw new Error(err.message);
                      }

                      // TODO: update entity as primary payment method?
                    }
                  } else if (
                    payToPayment?.status === 'PAYMENT_INITIATION_REJECTED'
                  ) {
                    //let newPaymentStatus = payToPayment.
                    // TODO update all tasks back to PAY_TO_RETRY if retryable ?
                    // TODO update all tasks back to PENDING_PAYMENT if retryable ?

                    //let tasks;
                    //try {
                    //  tasks = await queryAgreementTasks(
                    //    payToPayment.agreement_uuid
                    //  );
                    //  console.log('tasks: ', tasks);
                    //} catch (err) {
                    //  console.log('ERROR query agreement tasks: ', err);
                    //}

                    //if (tasks) {
                    //  for (const task of tasks) {
                    console.log('task: ', task);
                    // query task payments pending pay to transfer
                    //let taskPayments;
                    //try {
                    //  taskPayments = await queryTaskPayments(
                    //    task.id,
                    //    PaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION
                    //  );
                    //  console.log('taskPayments: ', taskPayments);
                    //} catch (err: any) {
                    //  console.log('ERROR getTaskPayments: ', err);
                    //  throw new Error(err.message);
                    //}

                    //if (taskPayments?.length > 0) {
                    //  for (const taskPayment of taskPayments) {
                    //    console.log('taskPayment: ', taskPayment);

                    let updatedPaymentRecord;
                    try {
                      updatedPaymentRecord = await updateRecord(
                        TABLE_PAYMENT ?? '',
                        { id: taskPayment.id },
                        { status: PaymentStatus.PAYMENT_INITIATION_REJECTED }
                      );

                      console.log(
                        'updatedPaymentRecord: ',
                        updatedPaymentRecord
                      );
                    } catch (err: any) {
                      console.log('ERROR update payment record', err);
                    }
                    //  }
                    //}

                    // update all tasks to pending payment
                    let updatedTask;
                    try {
                      updatedTask = await updateRecord(
                        TABLE_TASKS ?? '',
                        { id: task.id, entityId: task.entityId },
                        { paymentStatus: TaskPaymentStatus.PENDING_PAYMENT }
                      );

                      console.log('updatedTask: ', updatedTask);
                    } catch (err: any) {
                      console.log('ERROR update task record', err);
                    }
                  }
                  //  }
                  //}
                }
                // update payment to scheduled as it's scheduled for the future, take payment at later date
                else {
                  const updatedPaymentParams = {
                    status: getScheduledAtStatus({
                      amount: taskPayment.amount ?? 0,
                      scheduledAt: taskPayment.scheduledAt ?? '',
                    }), //TODO: payment waiting confirm or scheduled?
                    updatedAt: new Date().toISOString(),
                  };

                  try {
                    const updatedPayment = await updateRecord(
                      TABLE_PAYMENT ?? '',
                      { id: taskPayment.id },
                      updatedPaymentParams
                    );
                    console.log('Updated payment record: ', updatedPayment);
                  } catch (err: any) {
                    console.log('ERROR getPayment: ', err);
                    //throw new Error(err.message);
                  }

                  // update task to scheduled
                  let updatedTask;
                  try {
                    updatedTask = await updateRecord(
                      TABLE_TASKS ?? '',
                      { id: task.id, entityId: task.entityId },
                      { paymentStatus: TaskPaymentStatus.SCHEDULED }
                    );

                    console.log('updatedTask: ', updatedTask);
                  } catch (err: any) {
                    console.log('ERROR update task record', err);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
