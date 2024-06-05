const {
  TABLE_BENEFICIAL_OWNER,
  TABLE_ENTITY_BENEFICIAL_OWNER,
  TABLE_ENTITY_USER,
} = process.env;
import { getRecord } from '/opt/dynamoDB';
import { createFrankieOneAuthToken } from '/opt/frankieone';
import { validateEntityUser } from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

type TokenPresetKey = 'SMART_UI' | 'ONE_SDK';

const tokenPresetMap: Record<TokenPresetKey, 'smart-ui' | 'one-sdk'> = {
  SMART_UI: 'smart-ui',
  ONE_SDK: 'one-sdk',
};
export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { beneficialOwnerId, entityId, preset } = ctx.arguments.input;

  // referer url
  const referrer = ctx.request.headers.referer ?? '';

  console.log('referrer:', referrer);
  console.log('sub: ', sub);

  let beneficialOwner;
  try {
    beneficialOwner = await getRecord(TABLE_BENEFICIAL_OWNER ?? '', {
      id: beneficialOwnerId,
    });
  } catch (err: any) {
    console.log('ERROR get beneficial owner: ', err);
    throw new Error(err.message);
  }

  if (!beneficialOwner) {
    throw new Error('BENEFICIAL_OWNER_NOT_FOUND');
  }

  let entityBeneficialOwner;
  try {
    entityBeneficialOwner = await getRecord(
      TABLE_ENTITY_BENEFICIAL_OWNER ?? '',
      {
        beneficialOwnerId,
        entityId,
      }
    );
  } catch (err: any) {
    console.log('ERROR get beneficial owner: ', err);
    throw new Error(err.message);
  }

  if (!entityBeneficialOwner) {
    throw new Error('ENTITY_BENEFICIAL_OWNER_NOT_FOUND');
  }

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId: entityBeneficialOwner.entityId,
      userId: sub,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  console.log('beneficialOwner: ', beneficialOwner);

  // generate session token
  const authTokenParams = {
    preset: tokenPresetMap[preset as TokenPresetKey],
    referrer,
    entityId: beneficialOwner.providerEntityId,
  };
  console.log('authTokenParams: ', authTokenParams);
  let token;
  try {
    token = await createFrankieOneAuthToken(authTokenParams);
  } catch (err: any) {
    console.log('ERROR generate session token: ', err);
    throw new Error(err.message);
  }

  console.log('sessionTokenResponse: ', token);

  return {
    token,
  };
};
