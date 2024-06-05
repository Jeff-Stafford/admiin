const { TABLE_PAYMENT, TABLE_TASKS } = process.env;
import {
  BillsPaymentInput,
  CreatePaymentGuestInput,
  PayerUserStatus,
  Payment,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskStatus,
} from '/opt/API';
import { batchPut, getRecord, updateRecord } from '/opt/dynamoDB';
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
  validateBills,
  validateFeeId,
} from '/opt/zai';
import { AppSyncIdentityIAM } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import {
  getScheduledAtStatus,
  getTaskPaymentAmount,
  getTaskPaymentGstAmount,
} from '/opt/payment';

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
  const { taskId, entityId, paymentMethodId } =
    input as CreatePaymentGuestInput;

  // today sydney australia
  const todayDate = DateTime.now().setZone('Australia/Sydney').toISODate();

  console.log('cognitoIdentityId: ', cognitoIdentityId);
  console.log('sourceIp: ', sourceIp);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // TODO: validate payment method belongs to contactId / zai userId
  // get payment method for payment
  //let paymentMethod;
  //try {
  //  paymentMethod = await getRecord(TABLE_PAYMENT_METHODS ?? '', {
  //    id: paymentMethodId
  //  });
  //} catch (err: any) {
  //  console.log('ERROR get paymentMethod: ', err);
  //  throw new Error(err.message);
  //}

  //validatePaymentMethod(paymentMethod);

  // get all the tasks for payment
  const paymentsResponse = [];
  //let tasks: Task[] = [];
  //const keys = billPayments.map(({ id }: { id: string }) => ({ entityId, id }));
  //try {
  //  tasks = await batchGet({
  //    tableName: TABLE_TASKS ?? '',
  //    keys,
  //  });
  //
  //  console.log('tasks: ', tasks);
  //} catch (err: any) {
  //  console.log('ERROR batch get tasks: ', err);
  //  throw new Error(err.message);
  //}
  //
  //validateBills(tasks, billPayments, entityId);

  let task: Task;
  try {
    task = await getRecord(TABLE_TASKS ?? '', { id: taskId, entityId });
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  const billPayments = [
    {
      id: taskId,
      paymentType: PaymentType.PAY_NOW,
      scheduledAt: todayDate,
      installments: task?.numberOfPayments ?? 1,
    },
  ] as BillsPaymentInput[];

  validateBills([task], billPayments, entityId);

  // get zai fee to apply to payment if cc payment
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

  //for (let i = 0; i < tasks.length; i++) {
  //  const task = tasks[i];
  const taskPayment = billPayments.find(
    (billPayment: BillsPaymentInput) => billPayment.id === task.id
  );
  let payment: Payment;

  // prevents TS issues, validation occurs in validateBills
  if (!taskPayment || !task.amount) {
    throw new Error(`INVALID_BILL_PAYMENT`);
  }

  const { buyerId, sellerId, isTaxBill, sellerPhone, custom_descriptor } =
    await getPaymentFromToData(task);

  // get amount for this payment
  const amount = getTaskPaymentAmount({
    amount: task.amount,
    installments: taskPayment.installments,
    isFirstInstallment: true,
    isTaxBill,
  });

  const futurePayments = [];
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
          amount,
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
    try {
      const itemParams: CreateZaiItemRequest = {
        id: task.id,
        name: `task: ${task.id}`,
        amount,
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

  // scheduled payment - take payment in future
  if (taskPayment.paymentType === PaymentType.SCHEDULED) {
    payment = {
      id: zaiItem.id,
      entityId: task.entityId,
      taskId: task.id,
      amount,
      gstAmount: getTaskPaymentGstAmount({
        amount,
        isTaxBill,
        isFirstInstallment: true,
        gstInclusive: task.gstInclusive ?? false,
      }),
      status: getScheduledAtStatus({
        amount,
        scheduledAt: taskPayment.scheduledAt,
      }),
      installment: 1,
      installments: taskPayment.installments,
      paymentType: taskPayment.paymentType,
      paymentProvider: PaymentProvider.ZAI,
      ipAddress: ip,
      fromId: task.fromId,
      fromType: task.fromType,
      toId: task.toId,
      buyerId,
      sellerId,
      payerUserStatus: PayerUserStatus.NON_USER,
      createdAt: zaiItem.created_at + '',
      updatedAt: zaiItem.updated_at + '',
      scheduledAt: taskPayment.scheduledAt,
      __typename: 'Payment',
    };

    if (feeIds) {
      payment.feeIds = feeIds;
    }

    // update task to scheduled
    try {
      const taskParams = {
        paymentStatus: TaskPaymentStatus.SCHEDULED,
        status: TaskPaymentStatus.SCHEDULED,
        updatedAt: new Date().toISOString(),
      };

      await updateRecord(
        TABLE_TASKS ?? '',
        { entityId: task.entityId, id: task.id },
        taskParams
      );
    } catch (err: any) {
      console.log('ERROR update task status: ', err);
      throw new Error(err.message);
    }
  }

  // take payment for pay now / installments
  else {
    let itemPaymentData;
    const itemPaymentParams = {
      account_id: paymentMethodId,
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

    // TODO: handle bank. Also what if released amount = 0?
    if (
      zaiItem?.state === 'completed'
      //&& zaiItem?.released_amount === zaiItem?.amount
    ) {
      let updateTaskParams: Partial<Task> | null = null;

      // handle paynow reconciliation of task
      if (
        taskPayment.paymentType === PaymentType.PAY_NOW &&
        taskPayment.installments === 1
      ) {
        updateTaskParams = {
          paymentStatus: TaskPaymentStatus.PAID,
        };

        // set completed if signature completed / not required
        const newTaskStatus = getTaskStatus({
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
      // handle installments reconciliation of task
      else if (taskPayment.installments > 1) {
        updateTaskParams = {
          paymentStatus: TaskPaymentStatus.SCHEDULED,
          status: TaskStatus.SCHEDULED,
        };
      }

      if (updateTaskParams) {
        try {
          await updateRecord(
            TABLE_TASKS ?? '',
            { entityId: task.entityId, id: task.id },
            {
              ...updateTaskParams,
              updatedAt: new Date().toISOString(),
            }
          );
        } catch (err: any) {
          console.log('ERROR update task status: ', err);
          throw new Error(err.message);
        }
      }
    } else {
      console.log('UNHANDLED ZAI PAYMENT STATE: ', zaiItem?.state, zaiItem);
    }

    // create payment record with details from transaction
    payment = {
      id: zaiItem.id,
      entityId: task.entityId,
      taskId: task.id,
      amount,
      gstAmount: getTaskPaymentGstAmount({
        amount,
        isTaxBill,
        isFirstInstallment: true,
        gstInclusive: task.gstInclusive ?? false,
      }),
      buyerId,
      sellerId,
      paymentType: taskPayment.paymentType,
      paymentProvider: PaymentProvider.ZAI,
      ipAddress: ip,
      feeIds,
      fromId: task.fromId,
      fromType: task.fromType,
      toId: task.toId,
      scheduledAt: taskPayment.scheduledAt,
      installment: 1,
      installments: taskPayment.installments,
      status: ItemStatuses[zaiItem.status],
      payerUserStatus: PayerUserStatus.NON_USER,
      createdAt: zaiItem.created_at + '',
      updatedAt: zaiItem.updated_at + '',
      paidAt: new Date().toISOString(),
      __typename: 'Payment',
    };
  }

  // push payment to future payment requests
  futurePayments.push(payment);

  // create further installments if installments payment
  for (let j = 1; j < (taskPayment.installments ?? 1); j++) {
    const nextScheduledAt = DateTime.fromFormat(task.dueAt ?? '', 'yyyy-MM-dd')
      .plus({ months: j })
      .toFormat('yyyy-MM-dd');
    // create installment
    const createdAt = new Date().toISOString();
    const installment: Payment = {
      id: randomUUID(),
      entityId: task.entityId, //TODO: do we need payerEntityId or can that be calcualted from fromId and toId
      taskId: task.id,
      paymentType: PaymentType.INSTALLMENTS,
      paymentProvider: PaymentProvider.ZAI,
      ipAddress: ip,
      fromId: task.fromId,
      fromType: task.fromType,
      toId: task.toId,
      amount: getTaskPaymentAmount({
        amount: task.amount,
        installments: taskPayment.installments,
        isFirstInstallment: false,
        isTaxBill,
      }),
      gstAmount: getTaskPaymentGstAmount({
        amount: task.amount,
        isTaxBill,
        isFirstInstallment: false,
        gstInclusive: task.gstInclusive ?? false,
      }),
      buyerId,
      sellerId,
      status: PaymentStatus.GUEST_SCHEDULED,
      scheduledAt: nextScheduledAt,
      installment: j + 1,
      installments: taskPayment.installments,
      payerUserStatus: PayerUserStatus.NON_USER,
      createdAt,
      updatedAt: createdAt,
      __typename: 'Payment',
    };

    if (feeIds) {
      installment.feeIds = feeIds;
    }

    futurePayments.push(installment);
  }

  if (futurePayments.length > 0) {
    try {
      await batchPut({
        tableName: TABLE_PAYMENT ?? '',
        items: futurePayments,
      });
    } catch (err: any) {
      console.log('ERROR batch put installments: ', err);
      throw new Error(err.message);
    }
  }

  // if scheduled, update task to scheduled
  if (taskPayment.paymentType === PaymentType.SCHEDULED) {
    try {
      await updateRecord(
        TABLE_TASKS ?? '',
        { entityId: task.entityId, id: task.id },
        {
          paymentStatus: TaskPaymentStatus.SCHEDULED,
          taskStatus: TaskPaymentStatus.SCHEDULED,
        }
      );
    } catch (err: any) {
      console.log('ERROR update task status: ', err);
      throw new Error(err.message);
    }
  }

  paymentsResponse.push(...futurePayments);
  //}

  return paymentsResponse;
};
