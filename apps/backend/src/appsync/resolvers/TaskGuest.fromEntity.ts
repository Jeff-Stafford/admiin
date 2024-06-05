import { Context, DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

// gets entity from, if fromType is an entity and not an contact
export function request(ctx: Context): DynamoDBGetItemRequest {
  const { fromId } = ctx.source;

  return dynamoDBGetItemRequest({
    id: fromId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
