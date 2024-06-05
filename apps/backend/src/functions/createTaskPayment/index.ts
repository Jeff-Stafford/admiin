const { TABLE_ENTITY_USER, TABLE_TASKS, TABLE_PAYMENT, TABLE_PAYMENT_METHODS } =
  process.env;
import {
  Payment,
  PaymentMethodType,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  TaskPaymentStatus,
} from '/opt/API';
import { createRecord, getRecord, updateRecord } from '/opt/dynamoDB';
import { getTaskPaymentGstAmount } from '/opt/payment';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  CreateZaiItemRequest,
  getPaymentFromToData,
  getIsoDateFromZaiDate,
  initZai,
  ItemStatuses,
  listZaiFees,
  makeZaiPayment,
  validateEntityUser,
  validateFeeId,
  validatePaymentMethod,
  getTaskStatus,
  getTaskSearchStatus,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';

const DdbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DdbClient);

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

const queryTaskPayments = async (taskId: string) => {
  const today = DateTime.now().setZone('Australia/Sydney').toISODate();
  console.log("today's date: ", today);

  let nextToken = undefined;
  let allItems: (Payment | Record<string, any>)[] = [];

  do {
    const params = {
      TableName: TABLE_PAYMENT,
      IndexName: 'paymentsByTask',
      KeyConditionExpression: '#taskId = :taskId',
      ExpressionAttributeNames: {
        '#taskId': 'taskId',
      },
      ExpressionAttributeValues: {
        ':taskId': taskId,
      },
      ExclusiveStartKey: nextToken,
    };

    const command: QueryCommand = new QueryCommand(params);
    const data = await docClient.send(command);
    if (data.Items) {
      allItems = [...allItems, ...data.Items];
    }
    nextToken = data.LastEvaluatedKey;
  } while (nextToken);

  return allItems;
};

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { taskId, entityId, paymentMethodId } = input;

  console.log('claims.phone: ', claims.phone_number);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('Unable to find IP address for user');
  }

  const ip = sourceIp[0];

  let task;
  try {
    task = await getRecord(TABLE_TASKS ?? '', { id: taskId, entityId });
  } catch (err: any) {
    console.log('ERROR get task record: ', err);
  }

  if (!task) {
    throw new Error('NO_TASK_FOUND');
  }

  // get entity user to ensure they have permission to update the entity
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId: task.entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  console.log('entityUser: ', entityUser);

  validateEntityUser(entityUser);

  console.log('task to make payments for?: ', task);

  const { buyerId, sellerId, isTaxBill, sellerPhone, custom_descriptor } =
    await getPaymentFromToData(task);

  //let buyerId = null;
  //let sellerId = null;
  //if (task.toType === FromToType.ENTITY) {
  //  let buyerEntity;
  //  try {
  //    buyerEntity = await getRecord(TABLE_ENTITY ?? '', {
  //      id: task.toId,
  //    });
  //    console.log('buyerEntity: ', buyerEntity);
  //  } catch (err: any) {
  //    console.log('ERROR get entity: ', err);
  //    throw new Error(err.message);
  //  }
  //
  //  if (!buyerEntity) {
  //    throw new Error('ERROR_GET_ENTITY_TO');
  //  }
  //
  //  buyerId = buyerEntity.owner;
  //}
  //
  //// payment buyer is a contact
  //else if (task.toType === FromToType.CONTACT) {
  //  let buyerContact;
  //  try {
  //    buyerContact = await getRecord(TABLE_CONTACT ?? '', {
  //      id: task.toId,
  //    });
  //    console.log('buyerContact: ', buyerContact);
  //  } catch (err: any) {
  //    console.log('ERROR get contact: ', err);
  //    throw new Error(err.message);
  //  }
  //
  //  if (!buyerContact) {
  //    throw new Error('ERROR_GET_CONTACT_TO');
  //  }
  //
  //  buyerId = buyerContact.zaiUserId;
  //}
  //
  //let sellerEntity;
  //try {
  //  sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
  //    id: task.fromId,
  //  });
  //  console.log('sellerEntity: ', sellerEntity);
  //} catch (err: any) {
  //  console.log('ERROR get entity: ', err);
  //  throw new Error(err.message);
  //}
  //
  //if (!sellerEntity) {
  //  throw new Error('ERROR_GET_ENTITY_TO');
  //}
  //
  //sellerId = sellerEntity.owner;

  // query payments for task that requirement payment
  let taskPayments: Payment[] | Record<string, any> = [];
  try {
    taskPayments = await queryTaskPayments(taskId);
    console.log('taskPayments: ', taskPayments);
  } catch (err: any) {
    console.log('ERROR get task payments: ', err);
    throw new Error(err.message);
  }

  const payableTaskPayments = taskPayments.filter(
    (payment: Payment) =>
      payment.status === PaymentStatus.PENDING_USER_CONFIRMATION ||
      payment.status === PaymentStatus.USER_CONFIRMED ||
      payment.status === PaymentStatus.DECLINED ||
      payment.status === PaymentStatus.SCHEDULED
  );

  //TODO: declined payment items inclusive?  || payment.status === PaymentStatus.DECLINED
  const alreadyPaidTaskPayments = taskPayments.filter(
    (payment: Payment) => payment.status === PaymentStatus.COMPLETED
  );

  //TODO: declined payment items, need to void via zai api?

  if (payableTaskPayments?.length === 0) {
    throw new Error('NO_PAYABLE_TASK_PAYMENTS');
  }

  // calculate the remaining amount to be paid
  const amount = payableTaskPayments.reduce(
    (acc: number, payment: Payment) => acc + (payment.amount ?? 0),
    0
  );
  console.log('Amount remaining to be paid: ', amount);

  // paymentMethod for payment
  let paymentMethod;
  try {
    paymentMethod = await getRecord(TABLE_PAYMENT_METHODS ?? '', {
      id: paymentMethodId,
    });
  } catch (err: any) {
    console.log('ERROR get paymentMethod: ', err);
    throw new Error(err.message);
  }

  validatePaymentMethod(paymentMethod);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const feeIds: string[] = [];
  if (paymentMethod?.paymentMethodType === PaymentMethodType.CARD) {
    try {
      // get zai fee
      const zaiFeeData = await listZaiFees(zaiAuthToken?.access_token, {
        limit: 200,
        offset: 0,
      });
      console.log('zaiFeeData: ', zaiFeeData);
      const fee = zaiFeeData.fees.find((fee) => fee.name === 'CARD_220');
      if (fee?.id) {
        feeIds.push(fee.id);
      }
    } catch (err: any) {
      console.log('ERROR get zai fee: ', err);
      throw new Error(err.message);
    }
  }

  validateFeeId(feeIds);

  // create zai item
  const itemParams: CreateZaiItemRequest = {
    id: randomUUID(),
    name: `task: ${task.id}`,
    amount,
    currency: 'AUD',
    payment_type: 2, // TODO: payment type? not well documented on Zai api docs
    buyer_id: buyerId,
    seller_id: sellerId,
    custom_descriptor,
  };
  let zaiItem;
  try {
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
    console.log('ERROR createZaiItem err: ', JSON.stringify(err));
    throw new Error(err.message);
  }

  let itemPaymentData;
  const itemPaymentParams = {
    account_id: paymentMethod?.id,
    ip_address: ip,
    merchant_phone: sellerPhone,
  };
  console.log('makeZaiPayment params: ', itemPaymentParams);
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

  console.log('zaiItem: ', zaiItem);

  // TODO: handle bank. Also what if released amount = 0?
  let payment: Payment | undefined;
  if (
    zaiItem?.state === 'completed'
    //&& zaiItem?.released_amount === zaiItem?.amount
  ) {
    const taskParams: any = {
      //TODO: task type
      paymentStatus: TaskPaymentStatus.PAID,
      //paidAt: new Date().toISOString(),
      //fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
      //toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`,
      updatedAt: new Date().toISOString(),
    };

    // if not pending signature, update status to completed
    //if (task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE) {
    //  taskParams.status = TaskStatus.COMPLETED;
    //}

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
      taskParams.status = newTaskStatus;
      taskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
      taskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
    }

    try {
      await updateRecord(
        TABLE_TASKS ?? '',
        { entityId: task.entityId, id: task.id },
        taskParams
      );
    } catch (err: any) {
      console.log('ERROR update task status: ', err);
      throw new Error(err.message);
    }

    // create payment record
    const today = DateTime.now().setZone('Australia/Sydney').toISODate();
    console.log("today's date: ", today);

    payment = {
      id: zaiItem.id,
      entityId: task.entityId,
      taskId: task.id,
      amount,
      gstAmount: getTaskPaymentGstAmount({
        amount,
        installments: 1,
        isFirstInstallment: false,
        isTaxBill,
        gstInclusive: task.gstInclusive ?? false,
      }),
      buyerId: itemParams.buyer_id,
      sellerId: itemParams.seller_id,
      paymentType: PaymentType.PAY_NOW,
      paymentProvider: PaymentProvider.ZAI,
      ipAddress: ip,
      feeIds,
      fromId: task.fromId,
      fromType: task.fromType,
      toId: task.toId,
      toType: task.toType,
      scheduledAt: today,
      installment: alreadyPaidTaskPayments?.length + 1,
      installments: alreadyPaidTaskPayments?.length + 1 ?? 1,
      status: ItemStatuses[zaiItem.status],
      createdAt: getIsoDateFromZaiDate(zaiItem.created_at),
      updatedAt: getIsoDateFromZaiDate(zaiItem.updated_at),
      paidAt: new Date().toISOString(),
      __typename: 'Payment',
    };

    try {
      await createRecord(TABLE_PAYMENT ?? '', payment);
    } catch (err: any) {
      console.log('ERROR create payment record: ', err);
      throw new Error(err.message);
    }

    const updatedAt = new Date().toISOString();

    // update existing payment records
    const requests = payableTaskPayments.map((payment: Payment) =>
      updateRecord(
        TABLE_PAYMENT ?? '',
        { id: payment.id },
        {
          status: PaymentStatus.VOIDED,
          updatedAt,
          voidedAt: updatedAt,
        }
      )
    );

    try {
      const updatedPayments = await Promise.all(requests);
      console.log('updatedPayments: ', updatedPayments);
    } catch (err: any) {
      console.log('ERROR update payment records: ', err);
      throw new Error(err.message);
    }
  } else {
    console.log('UNHANDLED ZAI PAYMENT STATE: ', zaiItem?.state, zaiItem);
  }

  return payment ? [payment] : [];
};
