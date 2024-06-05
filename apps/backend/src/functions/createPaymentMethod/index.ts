const { TABLE_ENTITY, TABLE_ENTITY_USER, TABLE_PAYMENT_METHODS } = process.env;
import { AccountDirection, PaymentMethodStatus } from '/opt/API';
import { createRecord, getRecord, updateRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  getZaiBankAccount,
  initZai,
  setUserDisbursement,
  validateEntityUser,
} from '/opt/zai';
import { getCardAccount } from '/opt/zai/card';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { entityId, paymentMethodId, paymentMethodType, accountDirection } =
    input;

  const [entityUser, entity] = await Promise.all([
    getRecord(TABLE_ENTITY_USER ?? '', { userId: sub, entityId }),
    getRecord(TABLE_ENTITY ?? '', { id: entityId }),
  ]);

  console.log('entityUser: ', entityUser);
  console.log('entity: ', entity);

  validateEntityUser(entityUser);

  // verify paymentMethodId allowed for user / entity TODO: verify paymentMethodId allowed for user / entity

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const paymentMethodDetails: any = {};
  // get information for card account
  if (paymentMethodType === 'CARD') {
    try {
      const cardData = await getCardAccount(
        zaiAuthToken?.access_token,
        paymentMethodId
      );
      console.log('cardData: ', cardData);
      paymentMethodDetails.fullName = cardData.card_accounts.card.full_name;
      paymentMethodDetails.type = cardData.card_accounts.card.type;
      paymentMethodDetails.number = cardData.card_accounts.card.number;
      paymentMethodDetails.expMonth = cardData.card_accounts.card.expiry_month;
      paymentMethodDetails.expYear = cardData.card_accounts.card.expiry_year;
    } catch (err: any) {
      console.log('ERROR get card payment method: ', err);
      throw new Error(err.message);
    }
  }
  // get information for bank account
  else if (paymentMethodType === 'BANK') {
    try {
      const bankData = await getZaiBankAccount(
        zaiAuthToken?.access_token,
        paymentMethodId
      );
      console.log('bankData: ', bankData);
      paymentMethodDetails.accountName =
        bankData.bank_accounts.bank.account_name;
      paymentMethodDetails.bankName = bankData.bank_accounts.bank.bank_name;
      paymentMethodDetails.country = bankData.bank_accounts.bank.country;
      paymentMethodDetails.accountNumber =
        bankData.bank_accounts.bank.account_number;
      paymentMethodDetails.routingNumber =
        bankData.bank_accounts.bank.routing_number;
      paymentMethodDetails.holderType = bankData.bank_accounts.bank.holder_type;
      paymentMethodDetails.accountType =
        bankData.bank_accounts.bank.account_type;
    } catch (err: any) {
      console.log('ERROR get bank payment method: ', err);
      throw new Error(err.message);
    }
  }

  // save payment method to entity
  const createdAt = new Date().toISOString();
  const params = {
    ...paymentMethodDetails,
    id: paymentMethodId,
    entityId,
    owner: entity.owner,
    createdBy: sub,
    paymentMethodType,
    accountDirection,
    status: PaymentMethodStatus.ACTIVE,
    createdAt,
    updatedAt: createdAt,
  };

  console.log('payment method params: ', params);

  const entityParams =
    accountDirection === AccountDirection.PAYMENT
      ? { paymentMethodId }
      : { disbursementMethodId: paymentMethodId };

  const requests = [
    createRecord(TABLE_PAYMENT_METHODS ?? '', params),
    updateRecord(TABLE_ENTITY ?? '', { id: entityId }, entityParams),
  ];

  if (accountDirection === AccountDirection.DISBURSEMENT) {
    requests.push(
      setUserDisbursement(zaiAuthToken.access_token, entity.owner, {
        account_id: paymentMethodId,
      })
    );
  }

  try {
    const response = await Promise.all(requests);
    console.log('create / update / set response: ', response);
  } catch (err: any) {
    console.log(
      'ERROR update entity / create payment method / set disbursement: ',
      err
    );
    throw new Error(err.message);
  }

  return params;
};
