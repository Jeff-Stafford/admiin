const { TABLE_ENTITY, TABLE_PAYMENT, TABLE_TASKS } = process.env;
import { PaymentStatus, Task, TaskPaymentStatus } from '/opt/API';
import { getRecord, queryRecords, updateRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  CreateZaiItemRequest,
  getPaymentFromToData,
  getTaskSearchStatus,
  getTaskStatus,
  getZaiItem,
  initZai,
  ItemStatuses,
  listZaiFees,
  makeZaiPayment,
  updateZaiItem,
  validateFeeId,
  validatePayment,
} from '/opt/zai';
import { AppSyncIdentityIAM } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (
  ctx,
  _check1,
  _check2
) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  console.log('_check1: ', JSON.stringify(_check1));
  console.log('_check2: ', JSON.stringify(_check2));
  const { sourceIp, cognitoIdentityId } = ctx.identity as AppSyncIdentityIAM;
  const { input } = ctx.arguments;
  const { paymentId, paymentMethodId } = input as any;

  console.log('cognitoIdentityId: ', cognitoIdentityId);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // get payment
  let payment;
  try {
    payment = await getRecord(TABLE_PAYMENT ?? '', { id: paymentId });
    console.log('payment: ', payment);
  } catch (error) {
    console.error('Error getting payment', error);
    throw new Error('Error getting payment');
  }

  validatePayment({ payment });

  // get task
  let task;
  try {
    task = await getRecord(TABLE_TASKS ?? '', {
      id: payment.taskId,
      entityId: payment.entityId,
    });
  } catch (error) {
    console.error('Error getting task', error);
    throw new Error('Error getting task');
  }

  if (!task) {
    throw new Error('ERROR_TASK_NOT_FOUND');
  }

  let sellerEntity;
  try {
    sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
      id: payment.fromId,
    });
    console.log('entityFrom: ', sellerEntity);
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    //throw new Error(err.message);
  }

  const { buyerId, sellerId, custom_descriptor } = await getPaymentFromToData(
    task
  );

  let zaiItem;
  // get zai item
  try {
    const zaiItemData = await getZaiItem(zaiAuthToken?.access_token, task.id);
    zaiItem = zaiItemData?.items;
    console.log('zaiItem: ', zaiItem);
  } catch (err: any) {
    console.log('ERROR getZaiItem: ', err);
  }

  // existing zai item - update it
  if (zaiItem) {
    try {
      const zaiItemData = await updateZaiItem(
        zaiAuthToken?.access_token,
        task.id,
        {
          amount: payment.amount,
          name: `task: ${task.id}`,
          buyer_id: buyerId,
          seller_id: sellerId,
          custom_descriptor,
        }
      );
      zaiItem = zaiItemData?.items;
      console.log('zaiItemData: ', zaiItemData);
    } catch (err: any) {
      console.log('ERROR updateZaiItem: ', err);
      throw new Error(err.message);
    }
  }

  // new zai item required - create it
  else {
    let feeIds: string[] = [];
    try {
      const zaiFeeData = await listZaiFees(zaiAuthToken?.access_token, {
        limit: 200,
        offset: 0,
      });
      console.log('zaiFeeData: ', zaiFeeData);
      const fee = zaiFeeData.fees.find((fee) => fee.name === 'CARD_220');
      if (fee?.id) {
        feeIds = [fee?.id];
      }
    } catch (err: any) {
      console.log('ERROR get zai fee: ', err);
      throw new Error(err.message);
    }

    validateFeeId(feeIds);

    try {
      const itemParams: CreateZaiItemRequest = {
        id: task.id,
        name: `task: ${task.id}`,
        amount: payment.amount,
        currency: 'AUD',
        payment_type: 2, //TODO: payment type? not well documented on Zai api docs
        buyer_id: buyerId,
        seller_id: sellerId,
        custom_descriptor,
      };

      if (feeIds) {
        itemParams.fee_ids = feeIds.join(',');
      }

      console.log('create item params: ', itemParams);

      const zaiItemData = await createZaiItem(
        zaiAuthToken?.access_token,
        itemParams
      );
      console.log('zaiItemData: ', zaiItemData);
      zaiItem = zaiItemData?.items;
    } catch (err: any) {
      console.log('ERROR createZaiItem err: ', err);
      console.log('ERROR createZaiItem err?.errors: ', err?.errors);
      throw new Error(err.message);
    }
  }

  if (!zaiItem) {
    throw new Error('ERROR_CREATE_UPDATE_ZAI_ITEM');
  }

  let itemPaymentData;
  const itemPaymentParams = {
    account_id: paymentMethodId,
    ip_address: ip ?? '',
    merchant_phone: sellerEntity?.contact?.phone,
  };

  try {
    itemPaymentData = await makeZaiPayment(
      zaiAuthToken?.access_token,
      zaiItem.id,
      itemPaymentParams
    );
    console.log('makeZaiPayment data: ', itemPaymentData);
    zaiItem = itemPaymentData?.items;
  } catch (err: any) {
    console.log('ERROR makeZaiPayment: ', JSON.stringify(err));
    throw new Error(err.message);
  }

  // UPDATE PAYMENT
  const paymentParams: any = {
    status: ItemStatuses[zaiItem.status],
    updatedAt: zaiItem.updated_at,
  };

  if (zaiItem?.state === 'completed') {
    paymentParams.paidAt = new Date().toISOString();
    let updateTaskParams: Partial<Task> = {};
    if (payment.installment === 1 && payment.installments === 1) {
      updateTaskParams = {
        ...updateTaskParams,
        paymentStatus: TaskPaymentStatus.PAID,
      };

      const newTaskStatus = getTaskStatus({
        status: task.status,
        signatureStatus: task.signatureStatus,
        paymentStatus: TaskPaymentStatus.PAID,
      });
      if (task.status !== newTaskStatus) {
        const searchStatus = getTaskSearchStatus({
          status: newTaskStatus,
          signatureStatus: task.signatureStatus,
          paymentStatus: TaskPaymentStatus.PAID,
        });
        updateTaskParams.status = newTaskStatus;
        updateTaskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
        updateTaskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
      }
    }

    // For task with multiple installments, If all payments are paid, mark task as completed
    else {
      let allTaskPayments;
      try {
        const params = {
          tableName: TABLE_PAYMENT ?? '',
          indexName: 'paymentsByTask',
          keys: {
            taskId: task.id,
          },
        };
        allTaskPayments = await queryRecords(params);
        console.log('allTaskPayments: ', allTaskPayments);
      } catch (err: any) {
        console.log('ERROR get all task payments: ', err);
        throw new Error(err.message);
      }

      // if all paid, mark task as paid
      const allPaid =
        allTaskPayments &&
        allTaskPayments.every(
          (taskPayment) => taskPayment.status === PaymentStatus.COMPLETED
        );

      if (allPaid) {
        updateTaskParams = {
          ...updateTaskParams,
          paymentStatus: TaskPaymentStatus.PAID,
        };

        const newTaskStatus = getTaskStatus({
          status: task.status,
          signatureStatus: task.signatureStatus,
          paymentStatus: TaskPaymentStatus.PAID,
        });
        if (task.status !== newTaskStatus) {
          const searchStatus = getTaskSearchStatus({
            status: newTaskStatus,
            signatureStatus: task.signatureStatus,
            paymentStatus: TaskPaymentStatus.PAID,
          });
          updateTaskParams.status = newTaskStatus;
          updateTaskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
          updateTaskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
        }

        // if signed, set task status as completed
        //if (
        //  task?.status !== TaskStatus.COMPLETED &&
        //  task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
        //) {
        //  updateTaskParams = {
        //    ...updateTaskParams,
        //    status: TaskStatus.COMPLETED,
        //    fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
        //    toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
        //  };
        //}
      }
    }

    // update task if params to do so
    if (Object.entries(updateTaskParams)?.length > 0) {
      let updatedTask;
      try {
        updatedTask = await updateRecord(
          TABLE_TASKS ?? '',
          { id: task.id, entityId: task.entityId },
          { ...updateTaskParams, updatedAt: new Date().toISOString() }
        );
        console.log('updatedTask: ', updatedTask);
      } catch (err: any) {
        console.log('ERROR update task record', err);
        throw new Error(err.message);
      }
    }
  }

  try {
    const updatedPayment = await updateRecord(
      TABLE_PAYMENT ?? '',
      { id: zaiItem.id },
      paymentParams
    );

    console.log('updatedPayment: ', updatedPayment);
    return updatedPayment;
  } catch (err: any) {
    console.log('ERROR update payment record', err);
    throw new Error(err.message);
  }
};
