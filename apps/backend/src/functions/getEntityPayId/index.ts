const { TABLE_ENTITY_USER, TABLE_ENTITY, TABLE_TASKS } = process.env;
import { BillsPaymentInput, PaymentType, Task } from '/opt/API';
import { batchGet, getRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  getZaiUserWallet,
  GetZaiUserWalletResponse,
  initZai,
  validateBills,
  validateEntityUser,
  validateEntityTo,
} from '/opt/zai';
import { getWalletAccountNppDetails } from '/opt/zai/walletAccounts';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { getTaskPaymentAmount } from '/opt/payment';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { entityId, billPayments } = ctx.arguments as any; // CreatePaymentPayIdInput
  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }
  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  // get entity user to ensure they have permission to update the entity
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  console.log('entityUser: ', entityUser);

  validateEntityUser(entityUser);

  // get entity paying the bills / tasks
  let entityPayer;
  try {
    entityPayer = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entityPayer: ', err);
    throw new Error(err.message);
  }

  console.log('entityPayer: ', entityPayer);
  validateEntityTo(entityPayer);

  // get all the tasks for payment
  let tasks: Task[] = [];
  const keys = billPayments.map(({ id }: { id: string }) => ({ entityId, id }));
  try {
    tasks = await batchGet({
      tableName: TABLE_TASKS ?? '',
      keys,
    });

    console.log('tasks: ', tasks);
  } catch (err: any) {
    console.log('ERROR batch get tasks: ', err);
    throw new Error(err.message);
  }

  validateBills(tasks, billPayments, entityId);

  // calculate total amount to be received for payId transfer
  let totalAmount = 0;
  tasks.forEach((task: Task) => {
    const billPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );

    if (!billPayment || !task.amount) {
      throw new Error(`INVALID_BILL_PAYMENT`);
    }

    if (billPayment.paymentType !== PaymentType.SCHEDULED) {
      const amount = getTaskPaymentAmount({
        //paymentType: billPayment.paymentType,
        amount: task.amount,
        installments: billPayment.installments,
        isFirstInstallment: true,
        isTaxBill: false, //TODO: need to handle tax bill, currently payid deprecated
      });

      totalAmount += amount;
    }
  });

  // get the user wallet to see if funds have arrived
  let zaiUserWallet: GetZaiUserWalletResponse | null = null;
  try {
    zaiUserWallet = await getZaiUserWallet(
      zaiAuthToken?.access_token,
      entityPayer.owner
    );
    console.log('zaiUserWallet: ', zaiUserWallet);
  } catch (err: any) {
    console.log('ERROR get zai user wallet: ', err);
  }

  if (!zaiUserWallet) {
    throw new Error('NO_WALLET_ACCOUNT');
  }

  // get wallet account npp details for payout? //TODO: required?
  let walletAccountNppDetails;
  try {
    walletAccountNppDetails = await getWalletAccountNppDetails(
      zaiAuthToken?.access_token,
      zaiUserWallet?.wallet_accounts?.id ?? ''
    );
    console.log('walletAccountNppDetails: ', walletAccountNppDetails);
  } catch (err: any) {
    console.log('ERROR get wallet account npp details: ', err);
    throw new Error(err.message);
  }

  if (!walletAccountNppDetails) {
    throw new Error('NO_NPP_DETAILS');
  }

  return {
    transferAmount: totalAmount,
    payId: walletAccountNppDetails?.wallet_accounts?.npp_details?.pay_id ?? '',
    payIdReference:
      walletAccountNppDetails?.wallet_accounts?.npp_details?.reference ?? '',
    currency:
      walletAccountNppDetails?.wallet_accounts?.npp_details?.currency ?? '',
  };
};
