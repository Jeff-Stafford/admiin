const { TABLE_TASK } = process.env;
import {
  Task,
  UpdateTaskGuestInput,
  UpdateTaskGuestMutationVariables,
} from '/opt/API';
import { getRecord, updateRecord } from '/opt/dynamoDB';
import { validateExistingTask } from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

export const handler: AppSyncResolverHandler<
  UpdateTaskGuestMutationVariables,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { id, entityId, annotations } = input as UpdateTaskGuestInput;

  // validation to prevent ts errors
  if (!input) {
    throw new Error('No input provided');
  }

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  const ip = sourceIp[0];
  console.log('ip: ', ip);

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

  //TODO: validate change to annotations
  const updateParams: Partial<Task> = {
    annotations,
    updatedAt: new Date().toISOString(),
  };

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
