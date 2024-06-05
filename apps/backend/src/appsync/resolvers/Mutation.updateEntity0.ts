import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  runtime,
  util,
} from '@aws-appsync/utils';
import { UpdateEntityInput } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  if (util.authType() === 'IAM Authorization') {
    runtime.earlyReturn();
  }

  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.args;
  const { id } = input as UpdateEntityInput;

  return dynamoDBGetItemRequest({
    userId: sub,
    entityId: id,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;

  if (!result) {
    util.unauthorized();
  }

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
