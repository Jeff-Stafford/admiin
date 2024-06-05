const { TABLE_CONTACT, TABLE_ENTITY, TABLE_TASK, TABLE_USER } = process.env;
import { CreatePaymentMethodTokenInput, FromToType } from '/opt/API';
import { getRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createPaymentMethodToken,
  CreatePaymentMethodTokenRequest,
  initZai,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { isGuest, tokenType, taskId, entityId } = ctx.arguments
    .input as CreatePaymentMethodTokenInput;

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  if (isGuest && (!taskId || !entityId)) {
    throw new Error('NO_TASK_ID');
  }

  if (!isGuest && (taskId || entityId)) {
    throw new Error('TASK_NOT_ALLOWED');
  }

  let zaiUserId;
  if (!isGuest) {
    const { sub } = ctx.identity as AppSyncIdentityCognito;

    // get user
    let user;
    try {
      user = await getRecord(TABLE_USER ?? '', { id: sub });
      console.log('user: ', user);
      zaiUserId = user?.zaiUserId;
    } catch (err: any) {
      console.log('ERROR get user: ', err);
      throw new Error(err.message);
    }
  }

  // guest user, payment token based on task's contact
  else {
    let task;

    try {
      task = await getRecord(TABLE_TASK ?? '', { id: taskId, entityId });
      console.log('task: ', task);
    } catch (err: any) {
      console.log('ERROR get task: ', err);
      throw new Error(err.message);
    }

    if (!task) {
      throw new Error('ERROR_GET_TASK');
    }

    // TODO: NEED  to review We can allow guest to pay for toType ENTITY, as I believe will save payment method for logged in user's entity
    //if (task.toType !== FromToType.CONTACT) {
    //  throw new Error('INVALID_TASK');
    //}

    if (task.toType === FromToType.ENTITY) {
      let entity;
      try {
        entity = await getRecord(TABLE_ENTITY ?? '', {
          id: task.toId,
        });
        console.log('entity: ', entity);
      } catch (err: any) {
        console.log('ERROR get entity: ', err);
        throw new Error(err.message);
      }

      if (!entity) {
        throw new Error('ERROR_GET_ENTITY_TO');
      }
      zaiUserId = entity.zaiUserId;
    }

    // payment buyer is a contact
    else if (task.toType === FromToType.CONTACT) {
      let contact;
      try {
        contact = await getRecord(TABLE_CONTACT ?? '', {
          id: task.toId,
        });
      } catch (err: any) {
        console.log('ERROR get contact: ', err);
        throw new Error(err.message);
      }

      if (!contact) {
        throw new Error('ERROR_GET_CONTACT_TO');
      }

      console.log('contact: ', contact);
      zaiUserId = contact.zaiUserId;
    }

    let contact;
    try {
      contact = await getRecord(TABLE_CONTACT ?? '', { id: task.toId });
      console.log('contact: ', contact);
    } catch (err: any) {
      console.log('ERROR get contact: ', err);
      throw new Error(err.message);
    }

    zaiUserId = contact.zaiUserId;
  }

  if (!zaiUserId) {
    throw new Error('NO_PAYMENT_USER');
  }

  // create payment method token
  try {
    const params: CreatePaymentMethodTokenRequest = {
      token_type: tokenType,
      user_id: zaiUserId,
    };

    const response = await createPaymentMethodToken(
      zaiAuthToken?.access_token,
      params
    );
    console.log('createPaymentMethodToken response: ', response);
    return {
      token: response?.token_auth?.token,
      userId: zaiUserId,
    };
  } catch (err: any) {
    console.log('ERROR createPaymentMethodToken: ', err);
    throw new Error(err.message);
  }
};
