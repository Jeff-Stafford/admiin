import { Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { dynamodbUpdateRequest } from '../helpers/dynamodb';
export function request(ctx: Context): DynamoDBUpdateItemRequest {
  const {
    input: { id, ...values },
  } = ctx.args;

  const key = { id };

  const data = {
    ...values,
    updatedAt: util.time.nowISO8601(),
  };

  const condition = {
    id: { attributeExists: true },
  };

  return dynamodbUpdateRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}
