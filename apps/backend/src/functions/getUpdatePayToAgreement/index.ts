const { TABLE_ENTITY, TABLE_ENTITY_USER, TABLE_PAYTO_AGREEMENT } = process.env;
import { getRecord, updateRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  getPayToAgreement,
  initZai,
  validateEntityUser,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { agreementUuid } = ctx.arguments.input;

  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  console.log('sourceIp: ', sourceIp);

  const requests = [];

  let zaiAgreementRequest;
  try {
    zaiAgreementRequest = getPayToAgreement(
      zaiAuthToken?.access_token,
      agreementUuid
    );
    requests.push(zaiAgreementRequest);
  } catch (err: any) {
    console.log('ERROR getPayToAgreement: ', err);
    throw new Error(err.message);
  }

  let payToAgreementRecordRequest;
  try {
    payToAgreementRecordRequest = await getRecord(TABLE_PAYTO_AGREEMENT ?? '', {
      id: agreementUuid,
    });
    requests.push(payToAgreementRecordRequest);
  } catch (err: any) {
    console.log('ERROR validatePayToAgreement: ', err);
    throw new Error(err.message);
  }

  const [zaiAgreement, payToAgreementRecord] = await Promise.all(requests);

  console.log('zaiAgreement: ', zaiAgreement);
  console.log('payToAgreementRecord: ', payToAgreementRecord);

  if (!zaiAgreement) {
    throw new Error('PROVIDER_AGREEMENT_NOT_FOUND');
  }

  if (!payToAgreementRecord) {
    throw new Error('PLATFORM_PAYTO_AGREEMENT_NOT_FOUND');
  }

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId: payToAgreementRecord.entityId,
      userId: sub,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  let entityPayee;
  try {
    entityPayee = await getRecord(TABLE_ENTITY ?? '', {
      id: payToAgreementRecord.fromId,
    });
    console.log('entityPayee: ', entityPayee);
  } catch (err: any) {
    console.log('ERROR get entityPayee: ', err);
    throw new Error(err.message);
  }

  // update platform pay to agreement if status is different
  if (zaiAgreement.status !== payToAgreementRecord.status) {
    const updateAgreementParams = {
      status: zaiAgreement.status,
      updatedAt: new Date().toISOString(), //TODO: once Zai provide iso format date/time, set from zaiAgreement.updated_at
    };

    try {
      const updatedAgreementRecord = await updateRecord(
        TABLE_PAYTO_AGREEMENT ?? '',
        {
          id: agreementUuid,
        },
        updateAgreementParams
      );

      console.log('updatedAgreement: ', updatedAgreementRecord);
      return {
        ...updatedAgreementRecord,
        from: entityPayee,
      };
    } catch (err: any) {
      console.log('ERROR update pay to agreement: ', err);
      throw new Error(err.message);
    }
  }

  console.log('payToAgreementRecord: ', payToAgreementRecord);

  return {
    ...payToAgreementRecord,
    from: entityPayee,
  };
};
