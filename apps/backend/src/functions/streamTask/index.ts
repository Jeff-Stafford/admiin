import {
  Contact,
  Entity,
  FromToType,
  Task,
  TaskPaymentStatus,
  TaskSignatureStatus,
  TaskStatus,
} from '/opt/API';
import { currencyNumber } from '/opt/code';
import { batchPut, createRecord, getRecord } from '/opt/dynamoDB';
import { sendEmail } from '/opt/pinpoint';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { uuid4 } from '@sentry/utils';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { DateTime } from 'luxon';

const { FROM_EMAIL, TABLE_ACTIVITY, TABLE_ENTITY, TABLE_CONTACT, WEB_DOMAIN } =
  process.env;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // record created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const task = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as Task;

      console.log('task: ', task);

      // create record in activity table
      const createdAt = new Date().toISOString();
      const activityParams = {
        id: uuid4(),
        compositeId: `${task.entityId}#${task.id}`,
        message:
          task.status === TaskStatus.DRAFT ? 'TASK_DRAFT' : 'TASK_CREATED',
        userId: task.createdBy,
        entityId: task.entityId,
        type: 'TASK',
        createdAt,
        updatedAt: createdAt,
      };

      console.log('activityParams: ', activityParams);

      try {
        await createRecord(TABLE_ACTIVITY ?? '', activityParams);
      } catch (error) {
        console.log('ERROR create task activity: ', error);
      }

      // send transactional email if payment pending
      if (
        task.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT &&
        task.entityIdBy !== task.toId
      ) {
        let buyerEntity: Entity | null = null;
        let buyerContact: Contact | null = null;
        let sellerEntity: Entity | null = null;
        let toEmail: string | undefined | null = null;
        let firstName: string | undefined | null = null;
        if (task.toType === FromToType.ENTITY) {
          try {
            buyerEntity = await getRecord(TABLE_ENTITY ?? '', {
              id: task.toId,
            });

            toEmail = buyerEntity?.contact?.email;
            firstName = buyerEntity?.contact?.firstName;
            console.log('buyerEntity: ', buyerEntity);
          } catch (err: any) {
            console.log('ERROR get entity: ', err);
          }
        }

        // payment buyer is a contact
        else if (task.toType === FromToType.CONTACT) {
          try {
            buyerContact = await getRecord(TABLE_CONTACT ?? '', {
              id: task.toId,
            });

            toEmail = buyerContact?.email;
            firstName = buyerContact?.firstName;
            console.log('buyerContact: ', buyerContact);
          } catch (err: any) {
            console.log('ERROR get contact: ', err);
          }
        }

        try {
          sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
            id: task.fromId,
          });
          console.log('sellerEntity: ', sellerEntity);
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
        }

        if (toEmail && task.amount) {
          // send email to guest
          const templateData = {
            task: {
              ...task,
              from: sellerEntity?.legalName ?? '',
              totalWithCurrency:
                currencyNumber({ amount: task.amount / 100 }) ?? '',
              url: `${WEB_DOMAIN}/guest/pay-task?entityId=${task.entityId}&taskId=${task.id}`,
              dueAtFormatted: DateTime.fromISO(task.dueAt).toLocaleString(
                DateTime.DATE_HUGE
              ),
            },
            template: {
              title: `Invoice from ${sellerEntity?.legalName}`,
              preheader: `Your Latest Invoice from ${sellerEntity?.legalName}`,
            },
            user: {
              firstName: firstName ?? '',
            },
          };

          const emailParams = {
            senderAddress: FROM_EMAIL ?? '',
            toAddresses: [toEmail],
            templateName: 'invoice',
            templateData,
          };

          console.log('email params: ', emailParams);
          try {
            const sentEmail = await sendEmail(emailParams);
            console.log('sentEmail: ', sentEmail);
          } catch (err: any) {
            console.log('ERROR send invoice email: ', err);
          }
        }
      }
    }

    // record updated
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newTask = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as Task;
      const oldTask = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      ) as Task;
      console.log('newTask: ', newTask);
      console.log('oldTask: ', oldTask);

      // Create an array to hold all the activity messages
      const activityMessages: string[] = [];

      // Check for each status change and add the corresponding message to the array
      if (newTask.status !== oldTask.status) {
        if (newTask.status === TaskStatus.COMPLETED) {
          activityMessages.push('TASK_COMPLETED');
        } else if (newTask.status === TaskStatus.ARCHIVED) {
          activityMessages.push('TASK_ARCHIVED');
        } else if (newTask.status === TaskStatus.SCHEDULED) {
          activityMessages.push('TASK_SCHEDULED');
        }
      }

      if (newTask.signatureStatus !== oldTask.signatureStatus) {
        if (newTask.signatureStatus === TaskSignatureStatus.SIGNED) {
          activityMessages.push('TASK_SIGNED');
        }
      }

      if (newTask.paymentStatus !== oldTask.paymentStatus) {
        if (newTask.paymentStatus === TaskPaymentStatus.PAID) {
          activityMessages.push('TASK_PAID');
        } else if (newTask.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID) {
          activityMessages.push('TASK_MARKED_AS_PAID');
        }
      }

      // Iterate over the array and create an activity record for each message
      if (activityMessages.length > 0) {
        const activityRecords: any[] = [];
        for (const message of activityMessages) {
          const createdAt = new Date().toISOString();
          activityRecords.push({
            PutRequest: {
              Item: {
                id: uuid4(),
                compositeId: `${newTask.entityId}#${newTask.id}`,
                message,
                userId: newTask.createdBy,
                entityId: newTask.entityId,
                type: 'TASK',
                createdAt,
                updatedAt: createdAt,
              },
            },
          });
        }

        try {
          const batchPutActivity = await batchPut({
            tableName: TABLE_ACTIVITY ?? '',
            items: activityRecords,
          });
          console.log('batchPutActivity: ', batchPutActivity);
        } catch (error) {
          console.log('ERROR create task activity: ', error);
        }
      }
    }
  }
};
