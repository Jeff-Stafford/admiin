import {
  CreateZaiAuthTokenResponse,
  getFailedPayToPayment,
  initZai,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

//TODO: does this need authorisation check for user?

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { instructionId } = ctx.arguments;

  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  console.log('sourceIp: ', sourceIp);

  let failedPayment;
  try {
    failedPayment = await getFailedPayToPayment(
      zaiAuthToken?.access_token,
      instructionId
    );
    console.log('failedPayment: ', failedPayment);
  } catch (err: any) {
    console.log('ERROR getPayToFailedAgreement: ', err);
    throw new Error(err.message);
  }

  return {
    id: failedPayment.id,
    agreementUuid: failedPayment.agreement_uuid,
    errorMessage: failedPayment.error_message,
  };
};
