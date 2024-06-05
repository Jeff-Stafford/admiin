import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBPutItemRequest,
  util,
} from '@aws-appsync/utils';
import { EntityUserRole } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';

// create the entity as the owner of the newly created entity
export function request(ctx: Context): DynamoDBPutItemRequest {
  const {
    sub,
    claims: { given_name, family_name },
  } = ctx.identity as AppSyncIdentityCognito;
  const key = { userId: sub, entityId: ctx?.prev?.result?.id };
  const createdAt = util.time.nowISO8601();
  ctx.stash.entity = ctx?.prev?.result;

  const data = {
    id: util.autoId(),
    owner: sub,
    entityId: ctx?.prev?.result?.id,
    entitySearchName: ctx?.prev?.result?.name.toLowerCase() ?? '',
    searchName: `${given_name} ${family_name}`.toLowerCase() ?? '',
    firstName: given_name,
    lastName: family_name,
    role: EntityUserRole.OWNER,
    userId: sub,
    createdBy: sub,
    createdAt,
    updatedAt: createdAt,
  };
  const condition = { id: { attributeExists: false } };
  return dynamodbPutRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx?.prev?.result;
}
