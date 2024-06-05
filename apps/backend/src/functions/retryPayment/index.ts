const {
  TABLE_PAYMENT,
  TABLE_PAYMENT_METHODS,
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
} = process.env;
import { getRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  getZaiItem,
  initZai,
  makeZaiPayment,
  validateEntityUser,
  validatePaymentMethod,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { id, paymentMethodId } = input;

  const ip = sourceIp[0];

  // get payment
  let payment;
  try {
    payment = await getRecord(TABLE_PAYMENT ?? '', {
      id,
    });
  } catch (err: any) {
    console.log('ERROR get payment: ', err);
    throw new Error(err.message);
  }

  // get entity user
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId: payment.entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // paymentMethod for payment
  let paymentMethod;
  try {
    paymentMethod = await getRecord(TABLE_PAYMENT_METHODS ?? '', {
      id: paymentMethodId,
    });
  } catch (err: any) {
    console.log('ERROR get paymentMethod: ', err);
    throw new Error(err.message);
  }

  validatePaymentMethod(paymentMethod);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  // get existing zai item
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

  if (!zaiItem) {
    throw new Error('ERROR_GET_ZAI_ITEM');
  }

  let sellerEntity;
  try {
    sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
      id: payment.fromId,
    });
    console.log('sellerEntity: ', sellerEntity);
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  // retry payment
  let itemPaymentData;
  const itemPaymentParams = {
    account_id: paymentMethod?.id,
    ip_address: ip,
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
    throw new Error(err.message);
  }
};
