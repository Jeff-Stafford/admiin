const { TABLE_ENTITY, TABLE_PAYMENT, TABLE_TASKS } = process.env;
import { Payment, PaymentStatus, Task, TaskPaymentStatus } from '/opt/API';
import { getRecord, queryRecords, updateRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  CreateZaiItemRequest,
  getTaskSearchStatus,
  getTaskStatus,
  getZaiItem,
  initZai,
  ItemStatuses,
  makeZaiPayment,
  updateZaiItem,
} from '/opt/zai';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ScheduledEvent, Context } from 'aws-lambda';
import { DateTime } from 'luxon';

const DdbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DdbClient);

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

const queryScheduledPayments = async () => {
  const today = DateTime.now().setZone('Australia/Sydney').toISODate();
  console.log("today's date: ", today);

  let nextToken = undefined;
  let allItems: (Payment | Record<string, any>)[] = [];

  do {
    const params = {
      TableName: TABLE_PAYMENT,
      IndexName: 'paymentsByStatus',
      KeyConditionExpression: '#status = :status AND #scheduledAt <= :today',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#scheduledAt': 'scheduledAt',
      },
      ExpressionAttributeValues: {
        ':status': PaymentStatus.USER_CONFIRMED,
        ':today': today,
      },
      ExclusiveStartKey: nextToken,
    };

    const command: QueryCommand = new QueryCommand(params);
    const data = await docClient.send(command);
    if (data.Items) {
      allItems = [...allItems, ...data.Items];
    }
    nextToken = data.LastEvaluatedKey;
  } while (nextToken);

  return allItems;
};

export const handler = async (event: ScheduledEvent, context: Context) => {
  console.log('Cron Lambda triggered with event:', event);
  console.log('Context:', context);

  // today aest

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  let payments;
  try {
    payments = await queryScheduledPayments();
  } catch (err: any) {
    console.log('ERROR queryScheduledPayments: ', err);
    throw new Error(err.message);
  }

  console.log('scheduled payments: ', payments);

  if (payments?.length > 0) {
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i] as Payment; //TODO: payment BE type
      console.log('payment: ', payment);

      if (
        !payment.amount ||
        !payment.fromId ||
        !payment.toId ||
        !payment.toType
      ) {
        console.log('MISSING MANDATORY PAYMENT FIELDS: ', payment);
      }
      // able to do payment
      //TODO: from is not correct
      else {
        let sellerEntity;
        try {
          sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
            id: payment.fromId,
          });
          console.log('entityFrom: ', sellerEntity);
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
          //throw new Error(err.message);
        }

        let entityTo;
        try {
          entityTo = await getRecord(TABLE_ENTITY ?? '', {
            id: payment.toId,
          });
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
          //throw new Error(err.message);
        }

        let zaiItem;
        // get zai item
        try {
          const zaiItemData = await getZaiItem(
            zaiAuthToken?.access_token,
            payment.id
          );
          zaiItem = zaiItemData?.items;
        } catch (err: any) {
          console.log('ERROR getZaiItem: ', err);
          //throw new Error(err.message);
        }

        // existing zai item - update it
        if (zaiItem) {
          try {
            const zaiItemData = await updateZaiItem(
              zaiAuthToken?.access_token,
              payment.id,
              {
                amount: payment.amount,
                name: `payment: ${payment.id}`,
                buyer_id: payment.buyerId ?? '',
                seller_id: payment.sellerId ?? '',
                //custom_descriptors: '' //TODO: review with Zai, need some kind of descriptor? review with transaction / zai? Invoice ID?
              }
            );
            zaiItem = zaiItemData?.items;
          } catch (err: any) {
            console.log('ERROR updateZaiItem: ', err);
            //throw new Error(err.message);
          }
        }

        // new zai item, create it
        else {
          try {
            const itemParams: CreateZaiItemRequest = {
              id: payment.id,
              name: `payment: ${payment.id}`,
              amount: payment.amount,
              currency: 'AUD',
              payment_type: 2,
              buyer_id: payment.buyerId ?? '',
              seller_id: payment.sellerId ?? '',
              //custom_descriptors: '' //TODO: review with Zai, need some kind of descriptor? review with transaction / zai? Invoice ID?
            };

            //TODO: do we need to check payment method id is CARd or BANK and only apply fee, as may update?
            if (payment.feeIds) {
              itemParams.fee_ids = payment.feeIds.join(',');
            }

            console.log('create item params: ', itemParams);

            const zaiItemData = await createZaiItem(
              zaiAuthToken?.access_token,
              itemParams
            );
            zaiItem = zaiItemData?.items;
            console.log('zaiItemData: ', zaiItemData);
          } catch (err: any) {
            console.log('ERROR createZaiItem err: ', err);
            console.log('ERROR createZaiItem err?.errors: ', err?.errors);
            throw new Error(err.message);
          }
        }

        console.log('zaiItem: ', zaiItem);
        if (!zaiItem) {
          console.log('NO ZAI ITEM');
        } else {
          let itemPaymentData;
          const itemPaymentParams = {
            account_id: entityTo?.paymentMethodId,
            ip_address: payment.ipAddress ?? '',
            merchant_phone: sellerEntity?.contact?.phone,
          };

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
            //throw new Error(err.message);
          }

          // UPDATE PAYMENT
          const paymentParams: any = {
            status: ItemStatuses[zaiItem.status],
            updatedAt: zaiItem.updated_at,
          };

          let task;
          try {
            task = await getRecord(TABLE_TASKS ?? '', {
              entityId: payment.entityId,
              id: payment.taskId,
            });
          } catch (err: any) {
            console.log('ERROR get task: ', err);
            //throw new Error(err.message);
          }

          if (zaiItem?.state === 'completed') {
            paymentParams.paidAt = new Date().toISOString();
            let updateTaskParams: Partial<Task> = {};
            if (payment.installment === 1 && payment.installments === 1) {
              updateTaskParams = {
                ...updateTaskParams,
                paymentStatus: TaskPaymentStatus.PAID,
              };

              const newTaskStatus = getTaskStatus({
                status: task.status,
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

                const newTaskStatus = getTaskStatus({
                  status: task.status,
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

                // if signed, set task status as completed
                //if (
                //  task?.status !== TaskStatus.COMPLETED &&
                //  task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
                //) {
                //  updateTaskParams = {
                //    ...updateTaskParams,
                //    status: TaskStatus.COMPLETED,
                //    fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
                //    toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
                //  };
                //}
              }
            }

            // update task if params to do so
            if (Object.entries(updateTaskParams)?.length > 0) {
              let updatedTask;
              try {
                updatedTask = await updateRecord(
                  TABLE_TASKS ?? '',
                  { id: task.id, entityId: task.entityId },
                  { ...updateTaskParams, updatedAt: new Date().toISOString() }
                );
                console.log('updatedTask: ', updatedTask);
              } catch (err: any) {
                console.log('ERROR update task record', err);
              }
            }
          }

          try {
            await updateRecord(
              TABLE_PAYMENT ?? '',
              { id: zaiItem.id },
              paymentParams
            );
          } catch (err: any) {
            console.log('ERROR update payment record', err);
            //throw new Error(err.message);
          }
        }
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Payment cron job executed successfully' }),
  };
};
