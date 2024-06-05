const { TABLE_ENTITY, TABLE_ENTITY_USER } = process.env;
import { EntityType } from '/opt/API';
import { getRecord } from '/opt/dynamoDB';
import { initApi } from '/opt/frankieone';
import { validateEntityUser } from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId } = ctx.arguments.input;

  const frankieOne = initApi();
  console.log('frankieOne: ', frankieOne);

  console.log('entityId: ', entityId);
  console.log('sub: ', sub);

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId,
      userId: sub,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  let entity;
  try {
    entity = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
    console.log('entity: ', entity);
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  if (
    entity.entityType === EntityType.INDIVIDUAL ||
    entity.entityType === EntityType.SOLE_TRADER
  ) {
    throw new Error('ENTITY_NOT_BUSINESS');
  }

  if (entity.ubosCreated) {
    throw new Error('UBOS_ALREADY_CREATED');
  }

  // query frankieone business ownership
  // TODO: prevent check run 2nd time?
  // https://apidocs.frankiefinancial.com/docs/flows-and-sequence-diagram - Use the following Query Parameters for generating the UBO Report
  const ownershipParams = {
    organisation: {
      entityId: entity.frankieOneEntityId,
    },
  };

  let ownershipResponse;
  try {
    ownershipResponse = await frankieOne.business.businessOwnershipQuery(
      ownershipParams,
      {
        checkType: ['pep_media'],
        entityCategories: [
          'organisation',
          'ubos',
          'direct_owners',
          'officers_directors',
        ],
        //checkType: 'pep_media',
        //entityCategories: 'organisation,ubos,direct_owners,officers_directors',
        resultLevel: 'full',
        ownershipMode: 'onlyUBO',
      }
    );

    console.log('response: ', ownershipResponse?.data ?? ownershipResponse);
  } catch (err: any) {
    console.log(
      'ERROR frankieOne.business.businessOwnershipQuery: ',
      JSON.stringify(err)
    );
    throw new Error(`${err?.error?.errorCode}: ${err?.error?.errorMsg}`);
  }

  return {
    async: ownershipResponse.status === 202,
  };
};
