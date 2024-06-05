import { Context, DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { beneficialOwnerId } = ctx.source;

  return dynamoDBGetItemRequest({
    id: beneficialOwnerId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
