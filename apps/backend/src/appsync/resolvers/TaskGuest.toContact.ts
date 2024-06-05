import {
  Context,
  DynamoDBGetItemRequest,
  runtime,
  util,
} from '@aws-appsync/utils';
import { FromToType } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

// gets contact to, if toType is a contact and not an entity
export function request(ctx: Context): DynamoDBGetItemRequest {
  const { toId, toType } = ctx.source;

  if (toType !== FromToType.CONTACT) {
    runtime.earlyReturn();
  }

  return dynamoDBGetItemRequest({
    id: toId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
