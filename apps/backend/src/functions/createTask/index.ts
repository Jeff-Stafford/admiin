import {
  S3Upload,
  S3UploadInput,
  S3UploadType,
  Task,
  TaskCategory,
} from '/opt/API';
import { createRecord, getRecord } from '/opt/dynamoDB';
import {
  getTaskSearchStatus,
  getTaskPaymentStatus,
  getTaskSignatureStatus,
  getTaskStatus,
  validateEntityUser,
  validateNewTask,
  validateTaskToFrom,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { CreateTaskMutationVariables, TaskDirection } from '/opt/API';
const { TABLE_CONTACT, TABLE_ENTITY, TABLE_ENTITY_USER, TABLE_TASK } =
  process.env;

export const handler: AppSyncResolverHandler<
  CreateTaskMutationVariables,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments as CreateTaskMutationVariables;
  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  // validation to prevent ts errors
  if (!input) {
    throw new Error('No input provided');
  }
  if (!TABLE_ENTITY || !TABLE_CONTACT || !TABLE_ENTITY_USER || !TABLE_TASK) {
    throw new Error('TABLES_NOT_FOUND');
  }
  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  console.log(
    'input.annotations: ',
    input.annotations,
    typeof input.annotations
  );

  const ip = sourceIp[0];
  console.log('ip: ', ip);
  let documents: S3Upload[] = [];
  let entityId;
  let contactId;

  // GET ENTITY USER of task that's being created, for authorisation check
  if (input.direction === TaskDirection.SENDING) {
    entityId = input.fromId;
    contactId = input.toId;
  } else if (input.direction === TaskDirection.RECEIVING) {
    entityId = input.toId;
    contactId = input.fromId;
  }
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  // Task validation
  validateEntityUser(entityUser);
  validateNewTask(input);
  const { entityFrom } = await validateTaskToFrom(input);

  // Task statuses
  const signatureStatus = getTaskSignatureStatus({
    type: input.type,
    annotations: input.annotations,
  });
  const paymentStatus = getTaskPaymentStatus({
    type: input.type,
    settlementStatus: input.settlementStatus,
  });
  const taskStatus = getTaskStatus({
    status: input.status,
    signatureStatus,
    paymentStatus,
  });
  const searchStatus = getTaskSearchStatus({
    status: taskStatus,
    signatureStatus,
    paymentStatus,
  });

  // Task documents
  if (input.documents) {
    documents = input.documents.map(
      ({ level, key, identityId }: S3UploadInput) => {
        return {
          level,
          key,
          identityId,
          type: S3UploadType.PDF,
          __typename: 'S3Upload',
        };
      }
    );
  }

  const createdAt = new Date().toISOString();
  const createParams: Partial<Task> = {
    ...input,
    id: randomUUID(),
    documents,
    contactId,
    entityId: entityUser.entityId, //
    entityIdBy: entityUser.entityId, // TODO? what if created by accountant
    status: taskStatus,
    category:
      entityFrom?.subCategory === 'TAX' ? TaskCategory.TAX : TaskCategory.OTHER,
    signatureStatus,
    paymentStatus,
    entityByIdContactId: `${entityUser.entityId}#${
      entityUser.entityId === input.toId ? input.fromId : input.toId
    }`, //TODO: review logic, this is for searching bills created by an entity for contact, etc.
    fromSearchStatus: `${input.fromId}#${searchStatus}`, // allows search results for outbox
    toSearchStatus: `${input.toId}#${searchStatus}`, // allows search results for inbox
    createdBy: sub,
    createdAt,
    updatedAt: createdAt,
  };

  // search name
  if (input.reference) {
    createParams.searchName = input.reference.toLowerCase();
  }

  try {
    await createRecord(TABLE_TASK ?? '', createParams);
  } catch (err: any) {
    console.log('ERROR create task: ', err);
    throw new Error(err.message);
  }

  return createParams;
};
