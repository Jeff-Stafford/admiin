import { VerificationStatus } from '/opt/API';
import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBPutItemRequest,
  util,
} from '@aws-appsync/utils';
import { Entity } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';
import { toTitleCase } from '../helpers/entity';
import { generateEntityEmail } from '../helpers/ocr';

// creates the entity record
export function request(ctx: Context): DynamoDBPutItemRequest {
  const {
    sub,
    claims: { given_name, family_name, phone_number, email },
  } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;

  const key = { id: util.autoId() };
  const createdAt = util.time.nowISO8601();
  const ocrEmail = generateEntityEmail(input.name ?? '');

  //TODO: ENABLE WHEN INDIVIDUAL ASKING FIRST / LAST NAME
  // ensure first name if type individual
  //if (input.type === 'INDIVIDUAL' && !input.firstName) {
  //  throw new Error('INDIVIDUAL_FIRST_NAME_REQUIRED');
  //}

  //TODO: ENABLE WHEN INDIVIDUAL ASKING FIRST / LAST NAME
  // ensure last name if type individual
  //if (input.type === 'INDIVIDUAL' && !input.lastName) {
  //  throw new Error('INDIVIDUAL_LAST_NAME_REQUIRED');
  //}

  console.log('ocrEmail: ', ocrEmail);
  const data: Entity = {
    ...input,
    name: toTitleCase(input.name),
    owner: sub,
    paymentMethodId: null,
    searchName: input.name.toLowerCase() ?? '',
    phone: phone_number, //TODO: should not be used here?
    // email?
    contact: {
      firstName: given_name,
      lastName: family_name,
      email,
      phone: phone_number,
    },
    ubosCreated: null,
    verificationStatus: VerificationStatus.UNCHECKED,
    clientsEnabled: false,
    createdAt,
    updatedAt: createdAt,
  };

  if (ocrEmail) {
    data.ocrEmail = ocrEmail;
  }

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
