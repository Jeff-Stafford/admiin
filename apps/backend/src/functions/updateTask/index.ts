const { TABLE_ENTITY, TABLE_CONTACT, TABLE_ENTITY_USER, TABLE_TASK } =
  process.env;
import {
  S3Upload,
  S3UploadInput,
  S3UploadType,
  Task,
  UpdateTaskInput,
  UpdateTaskMutationVariables,
  UpdateTaskStatus,
} from '/opt/API';
import { getRecord, updateRecord } from '/opt/dynamoDB';
import {
  getTaskSearchStatus,
  getTaskPaymentStatus,
  getTaskSignatureStatus,
  getTaskStatus,
  validateEntityUser,
  validateExistingTask,
  validateNewTask,
  validateTaskToFrom,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

export const handler: AppSyncResolverHandler<
  UpdateTaskMutationVariables,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { id, entityId, ...restInput } = input as UpdateTaskInput;

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

  const ip = sourceIp[0];
  console.log('ip: ', ip);
  let documents: S3Upload[] = [];

  // GET ENTITY USER of task that's being created, for authorisation check
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId: entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // get and validate existing task
  let existingTask;
  try {
    existingTask = await getRecord(TABLE_TASK ?? '', {
      id: id,
      entityId,
    });
    console.log('existingTask: ', existingTask);
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  validateExistingTask(input, existingTask);

  // Task statuses
  const paymentStatus = getTaskPaymentStatus({
    type: input.type ?? existingTask.type,
    settlementStatus: input.settlementStatus ?? existingTask.settlementStatus,
  });
  const signatureStatus = getTaskSignatureStatus({
    type: input.type ?? existingTask.type,
    annotations: input.annotations ?? existingTask.annotations,
  });
  const taskStatus = getTaskStatus({
    status: input.status ?? existingTask.status,
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

  const updateParams: Partial<Task> = {
    ...restInput,
    documents,
    paymentStatus,
    signatureStatus,
    status: taskStatus,
    fromSearchStatus: `${input.fromId}#${searchStatus}`, // allows search results for outbox
    toSearchStatus: `${input.toId}#${searchStatus}`, // allows search results for inbox
    updatedAt: new Date().toISOString(),
  };

  // task changing from Draft to Incomplete (now sending out to recipient)
  if (input.status === UpdateTaskStatus.INCOMPLETE) {
    validateNewTask(input);
    await validateTaskToFrom({
      ...existingTask,
      ...input,
    });
  }

  let updatedTask;
  try {
    updatedTask = await updateRecord(
      TABLE_TASK ?? '',
      {
        id,
        entityId,
      },
      updateParams
    );
    console.log('updatedTask: ', updatedTask);
  } catch (err: any) {
    console.log('ERROR update task: ', err);
    throw new Error(err.message);
  }

  return updatedTask;
};
