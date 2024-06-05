import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBPutItemRequest,
  util,
} from '@aws-appsync/utils';
import { ContactStatus, ContactType } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';
import { toTitleCase } from '../helpers/entity';

export function request(ctx: Context): DynamoDBPutItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;

  const key = { id: util.autoId() };
  const createdAt = util.time.nowISO8601();
  const data = {
    ...input,
    firstName: input.firstName ? toTitleCase(input.firstName) : '',
    lastName: input.lastName ? toTitleCase(input.lastName) : '',
    owner: sub,
    status: ContactStatus.ACTIVE,
    type: ContactType.NORMAL,
    searchName: (
      input.companyName ?? `${input.firstName ?? ''} ${input.lastName ?? ''}`
    ).toLowerCase(),
    name: input.companyName
      ? toTitleCase(input.companyName)
      : toTitleCase(`${input.firstName} ${input.lastName}`),
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
  return ctx.result;
}
