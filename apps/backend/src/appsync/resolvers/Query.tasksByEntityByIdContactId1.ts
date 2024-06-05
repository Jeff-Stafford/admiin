import { Context, DynamoDBQueryRequest } from '@aws-appsync/utils';
import { dynamodbQueryRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBQueryRequest {
  const {
    args: { entityIdBy, contactId, limit, nextToken, sortDirection, filter },
  } = ctx;

  return dynamodbQueryRequest({
    key: 'entityByIdContactId',
    value: `${entityIdBy}#${contactId}`,
    index: 'tasksByEntityByIdContactId',
    filter,
    limit,
    nextToken,
    sortDirection,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}
