const { ANALYTICS_PINPOINT_ID, REGION, TABLE_CONTACT, TABLE_ENTITY } =
  process.env;
import {
  FromToType,
  Payment,
  PaymentStatus,
  Task,
  TaskPaymentStatus,
} from '/opt/API';
import { getRecord, queryRecords, updateRecord } from '/opt/dynamoDB';
import { getTaskSearchStatus, getTaskStatus } from '/opt/zai';
import {
  ChannelType,
  MessageType,
  PinpointClient,
  SendMessagesCommand,
} from '@aws-sdk/client-pinpoint';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { DateTime } from 'luxon';

const pinpoint = new PinpointClient({ region: REGION }); // replace with your region

const { TABLE_TASKS, TABLE_PAYMENT } = process.env;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // record created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const payment = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );

      console.log('payment: ', payment);
    }

    // record updated
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newPayment = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldPayment = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );
      console.log('newPayment: ', newPayment);
      console.log('oldPayment: ', oldPayment);

      // update task status to paid if all installments are paid
      if (
        oldPayment?.paymentStatus !== PaymentStatus.COMPLETED &&
        newPayment?.paymentStatus === PaymentStatus.COMPLETED
      ) {
        // check if all payments made are completed
        let taskPayments: Payment[] | Record<string, any> = [];
        //try {
        //  taskPayments = await queryTaskPayments(newPayment.taskId);
        //  console.log('taskPayments: ', taskPayments);
        //} catch (err: any) {
        //  console.log('ERROR get task payments: ', err);
        //}

        try {
          const params = {
            tableName: TABLE_PAYMENT ?? '',
            indexName: 'paymentsByTask',
            keys: {
              taskId: newPayment.taskId,
            },
            filter: {
              status: PaymentStatus.PENDING_PAYMENT_INITIATION,
            },
          };

          taskPayments = await queryRecords(params);
        } catch (err: any) {
          console.log('ERROR get task payments: ', err);
        }

        // if all payments made are status completed, update task status to paid
        const isCompleted =
          taskPayments?.length > 0 &&
          taskPayments?.every(
            (payment: Payment) => payment.status === PaymentStatus.COMPLETED
          );
        console.log('isCompleted: ', isCompleted);
        if (isCompleted) {
          // get task
          let task: Task = {} as Task;
          try {
            task = await getRecord(TABLE_TASKS ?? '', {
              id: newPayment.taskId,
            });
          } catch (err: any) {
            console.log('ERROR get task record: ', err);
          }

          console.log('task to update?: ', task);

          // if task is not already paid, update task status to paid
          if (task && task?.paymentStatus !== TaskPaymentStatus.PAID) {
            const taskParams: any = {
              paymentStatus: TaskPaymentStatus.PAID,
              updatedAt: new Date().toISOString(),
            };

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
              taskParams.status = newTaskStatus;
              taskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
              taskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
            }

            //if (
            //  task?.status !== TaskStatus.COMPLETED &&
            //  task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
            //) {
            //  taskParams.status = TaskStatus.COMPLETED;
            //  taskParams.fromSearchStatus = `${task.fromId}#${TaskSearchStatus.COMPLETED}`;
            //  taskParams.toSearchStatus = `${task.toId}#${TaskSearchStatus.COMPLETED}`;
            //}

            console.log('taskParams: ', taskParams);

            try {
              await updateRecord(
                TABLE_TASKS ?? '',
                { id: newPayment.taskId },
                taskParams
              );
            } catch (err: any) {
              console.log('ERROR update task record', err);
            }
          }
        }
      }

      // send notification if payment requires user confirmation
      if (
        oldPayment?.paymentStatus !== PaymentStatus.PENDING_USER_CONFIRMATION &&
        newPayment?.paymentStatus === PaymentStatus.PENDING_USER_CONFIRMATION &&
        newPayment?.toType === FromToType.ENTITY //currently only entity will do confirmation over 1k supported
      ) {
        // Get company name of payee for the sms
        let companyName = '';

        if (newPayment.fromType === FromToType.ENTITY) {
          let entityFrom;
          try {
            entityFrom = await getRecord(TABLE_ENTITY ?? '', {
              id: newPayment.fromId,
            });
          } catch (err: any) {
            console.log('ERROR get entity: ', err);
          }

          if (entityFrom?.name) {
            companyName =
              entityFrom.name?.length < 8
                ? entityFrom.name
                : entityFrom.name.substring(0, 5) + '...';
          }
        }

        // contact type
        else if (newPayment.fromType === FromToType.CONTACT) {
          let contactFrom;
          try {
            contactFrom = await getRecord(TABLE_CONTACT ?? '', {
              id: newPayment.fromId,
            });
          } catch (err: any) {
            console.log('ERROR get user: ', err);
          }

          if (contactFrom?.name) {
            companyName =
              contactFrom.name?.length < 8
                ? contactFrom.name
                : contactFrom.name.substring(0, 5) + '...';
          }
        }

        // payer company details to address sms to
        let entityTo;
        try {
          entityTo = await getRecord(TABLE_ENTITY ?? '', {
            id: newPayment.toId,
          });
          console.log('entityTo: ', entityTo);
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
          throw new Error(err.message);
        }

        if (
          entityTo?.contact?.phone &&
          newPayment.amount &&
          newPayment.scheduledAt
        ) {
          // task sms details
          const amountInDollars = (newPayment.amount / 100).toFixed(2);
          const scheduledDate = DateTime.fromISO(
            newPayment.scheduledAt
          ).toFormat('dd/LL/yy');

          // send sms to payer via pinpoint
          const params = {
            ApplicationId: ANALYTICS_PINPOINT_ID ?? '', // replace with your Application ID
            MessageRequest: {
              Addresses: {
                [entityTo.contact.phone]: {
                  // replace with the recipient's phone number
                  ChannelType: ChannelType.SMS,
                },
              },
              MessageConfiguration: {
                SMSMessage: {
                  Body: `Your payment of $${amountInDollars} to ${companyName} is scheduled on ${scheduledDate}. As a security measure we require confirmation. Log into admiin.com to confirm`,
                  MessageType: MessageType.TRANSACTIONAL,
                  //OriginationNumber: '+0987654321' // replace with your origination number
                },
              },
            },
          };
          try {
            const command = new SendMessagesCommand(params);
            const data = await pinpoint.send(command);
            console.log('Message response: ', data); // successful response
          } catch (err: any) {
            console.log(err, err.stack); // an error occurred
          }
        }
      }
    }
  }
};
