import { Context, util, DynamoDBGetItemRequest } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const {
    args: { id },
  } = ctx;
  return dynamoDBGetItemRequest({ id });
}

//TODO: limit fields that are visible?
export function response(ctx: Context) {
  const { error, result } = ctx;
  //const { sub } = ctx.identity as AppSyncIdentityCognito;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}
