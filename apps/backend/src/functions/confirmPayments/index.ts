const { TABLE_ENTITY_USER, TABLE_PAYMENT } = process.env;
import { batchGet, updateRecord } from '/opt/dynamoDB';
import { validateEntityUser } from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { ConfirmPaymentInput, PaymentStatus } from '/opt/API';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { payments } = ctx.arguments.input as ConfirmPaymentInput;

  // batch get payments
  let paymentRecords = [];
  try {
    paymentRecords = await batchGet({
      keys: payments.map((payment) => ({ id: payment })),
      tableName: TABLE_PAYMENT ?? '',
    });
    console.log('Payment records: ', paymentRecords);
  } catch (error) {
    console.error('Error fetching payments: ', error);
    throw new Error('Error fetching payments');
  }

  // batch get entity users from sub and entityid
  let entityUsers = [];
  try {
    const keys = paymentRecords.reduce((acc, payment) => {
      const duplicateIndex = acc.findIndex(
        (item: { entityId: string; userId: string }) =>
          item.entityId === payment.entityId && item.userId === sub
      );
      if (duplicateIndex === -1) {
        acc.push({ entityId: payment.entityId, userId: sub });
      }
      return acc;
    }, [] as Array<{ entityId: string; userId: string }>);
    entityUsers = await batchGet({
      keys,
      tableName: TABLE_ENTITY_USER ?? '',
    });
    console.log('Entity users: ', entityUsers);
  } catch (error) {
    console.error('Error fetching entity users: ', error);
    throw new Error('Error fetching entity users');
  }

  if (entityUsers.length === 0) {
    throw new Error('UNAUTHORISED');
  }

  //if (entityUsers?.length !== paymentRecords?.length) {
  //  throw new Error('UNAUTHORISED');
  //}

  const response = [];
  // update each payment to USER_CONFIRMED
  for (const payment of paymentRecords) {
    // ensure there is an entity user for the payment by payment.entityId and sub
    const entityUser = entityUsers.find(
      (item) => item.entityId === payment.entityId && item.userId === sub
    );

    validateEntityUser(entityUser);

    if (payment.status === PaymentStatus.PENDING_USER_CONFIRMATION) {
      try {
        const updatedRecord = await updateRecord(
          TABLE_PAYMENT ?? '',
          { id: payment.id },
          { status: PaymentStatus.USER_CONFIRMED }
        );
        response.push(updatedRecord);
      } catch (error) {
        console.error('Error updating payment: ', error);
        throw new Error('Error updating payment');
      }
    }
  }

  return response;
};
