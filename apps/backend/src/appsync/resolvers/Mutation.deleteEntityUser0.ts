import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  util,
} from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const {
    input: { entityId },
  } = ctx.args;

  return dynamoDBGetItemRequest({
    userId: sub,
    entityId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;

  // if no entity user, not authorised
  if (!result) {
    util.unauthorized();
  }

  if (result?.role !== 'OWNER') {
    util.unauthorized();
  }

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}
