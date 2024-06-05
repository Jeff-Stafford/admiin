import { Context, DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { entityId, beneficialOwnerId } = ctx.args;

  return dynamoDBGetItemRequest({
    entityId,
    beneficialOwnerId,
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

  return ctx.result;
}
