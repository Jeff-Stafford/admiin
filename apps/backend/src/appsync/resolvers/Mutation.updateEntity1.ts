import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBUpdateItemRequest,
  util,
} from '@aws-appsync/utils';
import { UpdateEntityInput } from '../API';
import { isAdmin } from '../helpers/cognito';
import { dynamodbUpdateRequest } from '../helpers/dynamodb';

//TODO: refactor prop validation - block permission by default
export function request(ctx: Context): DynamoDBUpdateItemRequest {
  const { sub, groups } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.args;
  const { id, ...values } = input as UpdateEntityInput;
  const key = { id };

  let condition;
  if (util.authType() !== 'IAM Authorization' && !isAdmin(groups)) {
    if (values.verificationStatus) {
      util.unauthorized();
    }

    if (values.pepCheckStatus) {
      util.unauthorized();
    }

    if (values.firstName || values.lastName || values.legalName) {
      util.unauthorized();
    }

    if (values.ubosCreated === true || values.ubosCreated === false) {
      util.unauthorized();
    }

    if (values.numUbosCreated || values.numUbosCreated === 0) {
      util.unauthorized();
    }

    condition = {
      id: { attributeExists: true },
      owner: { eq: sub },
    };
  }

  //TODO: need condtion? Expression block '$[condition]' requires an expression
  if (util.authType() === 'IAM Authorization') {
    condition = {
      id: { attributeExists: true },
    };
  }

  //TODO: verify paymentMethodId belongs to entity

  const data = {
    ...values,
    updatedAt: util.time.nowISO8601(),
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
