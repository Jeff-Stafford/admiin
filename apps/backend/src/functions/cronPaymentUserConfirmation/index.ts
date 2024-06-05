const {
  FROM_EMAIL,
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_PAYMENT,
  TABLE_TASK,
  WEB_DOMAIN,
} = process.env;
import { Contact, Entity, FromToType, Payment, PaymentStatus } from '/opt/API';
import { currencyNumber } from '/opt/code';
import { getRecord, updateRecord } from '/opt/dynamoDB';
import { sendEmail } from '/opt/pinpoint';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ScheduledEvent, Context } from 'aws-lambda';
import { DateTime } from 'luxon';

const DdbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DdbClient);

const queryCustomerConfirmPayments = async () => {
  const today = DateTime.now().setZone('Australia/Sydney').toISODate();
  const twoDaysFromNow = DateTime.now()
    .setZone('Australia/Sydney')
    .plus({ days: 2 })
    .toISODate();
  console.log('Dates between: ', today, twoDaysFromNow);

  let nextToken = undefined;
  let allItems: (Payment | Record<string, any>)[] = [];

  do {
    const params = {
      TableName: TABLE_PAYMENT,
      IndexName: 'paymentsByStatus',
      KeyConditionExpression:
        '#status = :status and #scheduledAt BETWEEN :today AND :twoDaysFromNow',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#scheduledAt': 'scheduledAt',
      },
      ExpressionAttributeValues: {
        ':status': PaymentStatus.SCHEDULED,
        ':today': today,
        ':twoDaysFromNow': twoDaysFromNow,
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

// query payments that are guest_scheduled and 5 days from dueAt
const queryGuestScheduledPayments = async (): Promise<Payment[]> => {
  const today = DateTime.now().setZone('Australia/Sydney').toISODate();
  const fiveDaysFromNow = DateTime.now()
    .setZone('Australia/Sydney')
    .plus({ days: 5 })
    .toISODate();
  console.log('Dates between: ', today, fiveDaysFromNow);

  let nextToken = undefined;
  let allItems: (Payment | Record<string, any>)[] = [];

  do {
    const params = {
      TableName: TABLE_PAYMENT,
      IndexName: 'paymentsByStatus',
      KeyConditionExpression:
        '#status = :status and #scheduledAt = :fiveDaysFromNow',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#scheduledAt': 'scheduledAt',
      },
      ExpressionAttributeValues: {
        ':status': PaymentStatus.GUEST_SCHEDULED,
        ':fiveDaysFromNow': fiveDaysFromNow,
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

  // CONFIRM PAYMENTS CRON
  let userConfirmPayments;
  try {
    userConfirmPayments = await queryCustomerConfirmPayments();
  } catch (err: any) {
    console.log('ERROR queryScheduledPayments: ', err);
    throw new Error(err.message);
  }
  console.log('customer pending payments: ', userConfirmPayments);

  if (userConfirmPayments?.length > 0) {
    for (let i = 0; i < userConfirmPayments.length; i++) {
      const payment = userConfirmPayments[i] as Payment;
      console.log('payment: ', payment);

      // update payment to status PENDING_USER_CONFIRMATION
      let updatedPayment;
      try {
        updatedPayment = await updateRecord(
          TABLE_PAYMENT ?? '',
          {
            id: payment.id,
          },
          { status: PaymentStatus.PENDING_USER_CONFIRMATION }
        );
        console.log('updatedPayment: ', updatedPayment);
      } catch (err: any) {
        console.log('ERROR update payment: ', err);
        //throw new Error(err.message);
      }
    }
  }

  // GUEST PAYMENTS NOTIFICATION
  let guestScheduledPayments: Payment[] = [];
  try {
    guestScheduledPayments = await queryGuestScheduledPayments();
    console.log('guest scheduled payments: ', guestScheduledPayments);
  } catch (err: any) {
    console.log('ERROR queryScheduledPayments: ', err);
  }

  // send email to guest scheduled payments
  if (guestScheduledPayments?.length > 0) {
    for (let i = 0; i < guestScheduledPayments.length; i++) {
      const payment = guestScheduledPayments[i] as Payment;
      console.log('payment: ', payment);

      let task;
      try {
        task = await getRecord(TABLE_TASK ?? '', {
          id: payment.taskId,
        });
        console.log('task: ', task);
      } catch (err: any) {
        console.log('ERROR get task: ', err);
      }

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
      if (toEmail) {
        try {
          sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
            id: task.fromId,
          });
          console.log('sellerEntity: ', sellerEntity);
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
        }

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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Payment user confirmation cron job executed successfully',
    }),
  };
};
