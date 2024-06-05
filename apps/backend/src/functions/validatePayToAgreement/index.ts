const { TABLE_ENTITY, TABLE_ENTITY_USER, TABLE_PAYTO_AGREEMENT, TABLE_TASKS } =
  process.env;
import {
  BillsPaymentInput,
  EntityType,
  PaymentFrequency,
  PaymentType,
  Task,
} from '/opt/API';
import { batchGet, createRecord, getRecord, updateRecord } from '/opt/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  GeneratePayToParams,
  getIsoDateFromZaiDate,
  PaymentTermFrequency,
  validateBills,
  validateEntityUser,
  validateEntityTo,
  validatePayToAgreement,
  ValidatePayToAgreementRequest,
  initZai,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { DateTime } from 'luxon';
import { getTaskPaymentAmount } from '/opt/payment';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

//TODO: should not be able to re-trigger if agreement already pending / exists?

const generatePayToParams = ({
  task,
  entityPayer, // debitor
  entityPayee, // creditor
  description,
  bsb,
  accountNumber,
  paymentType,
  installments,
  scheduledAt,
}: GeneratePayToParams): ValidatePayToAgreementRequest => {
  //const today = DateTime.now()
  //  .setZone('Australia/Sydney')
  //  .toFormat('yyyy-MM-dd');
  //if (!entity.contact) {
  //  throw new Error('NO_ENTITY_CONTACT');
  //}
  //
  //if (!entity.legalName) {
  //  throw new Error('NO_ENTITY_LEGAL_NAME');
  //}
  //
  //if (!entity.taxNumber) {
  //  throw new Error('NO_ENTITY_TAX_NUMBER');
  //}
  //
  //if (!entityTo.legalName) {
  //  throw new Error('NO_ENTITY_TO_LEGAL_NAME');
  //}
  //
  //if (!task.paymentFrequency) {
  //  throw new Error('NO_PAYMENT_FREQUENCY');
  //}
  //
  //if (!task.amount) {
  //  throw new Error('NO_PAYMENT_AMOUNT');
  //}

  const params: ValidatePayToAgreementRequest = {
    user_external_id: entityPayer?.owner,
    priority: 'ATTENDED',
    //response_requested_by: '', // add custom iso date if need agreement within 5 days
    agreement_info: {
      description: description ?? `Payment for ${task.reference}`, //TODO: better description, e.g. for tax, business 2 business, etc?
      //short_description: 'Admiin payments limit', // anything more we should add here?
      purpose_code: 'OTHR', //TODO: TAXS for tax payments? UTIL and other. Collect from create bill (what payment is for)?
      agreement_type: 'AUPM',
      automatic_renewal: false,
      validity_start_date: scheduledAt,
      debtor_info: {
        debtor_account_details: {
          // Entity making payment details
          account_id_type: 'BBAN',
          account_id: `${bsb}${accountNumber}`, // BSB and account number
          //payid_details: { // disabled - only support bsb / account number for now
          //  payid_type: "TELI",
          //  payid: "payid"
          //}
        },
        debtor_details: {
          // Entity who will approve the agreement in their banking app
          debtor_name: `${entityPayer?.contact?.firstName ?? ''} ${
            entityPayer?.contact?.lastName ?? ''
          }`,
          debtor_type:
            entityPayer.type === EntityType.COMPANY ? 'ORGN' : 'PERS',
          ultimate_debtor_name: entityPayer.legalName as string, // legal name
          //debtor_id: entityPayer.type === EntityType.INDIVIDUAL ? '56967586975' : entityPayer.taxNumber ?? 'demo-debtor-id', // TODO - set correctly
          //debtor_id_type: 'AUBN', //CCPT - passport, AUBN - ABN, AUCN - ACN, DRLC - driver's licence
          //debtor_reference: ""
        },
      },
      creditor_info: {
        // platform or seller details
        ultimate_creditor_name: entityPayee.legalName as string,
        creditor_reference: task.reference ?? '',
      },
      payment_initiator_info: {
        // platform or seller details
        initiator_id: '66667797828',
        initiator_id_type_code: 'AUBN',
        initiator_legal_name: 'SIGNPAY PTY LTD',
        initiator_name: 'Admiin',
      },
      payment_terms: {
        payment_amount_info: {
          amount: task.amount
            ? getTaskPaymentAmount({
                amount: task.amount,
                installments,
                isFirstInstallment: false,
                isTaxBill: false, //TODO: PayTo is parked, need to handle tax bill if activated
              }).toString()
            : '', // For USGB/VARI, indicates the minimum amount per payment.
          currency: 'AUD',
          type: 'FIXE',
        },
        first_payment_info: {
          amount: task.amount
            ? getTaskPaymentAmount({
                amount: task.amount,
                installments,
                isFirstInstallment: true,
                isTaxBill: false, //TODO: PayTo is parked, need to handle tax bill if activated
              }).toString()
            : '', // For USGB/VARI, indicates the first payment amount
          currency: 'AUD',
          date: scheduledAt,
        },
        // first_payment_info // will be good for initial payment and re-occurring followed by
        //maximum_amount_info: {
        //  // Represents the maximum amount that may be debited in any single payment initiation
        //  amount: maxPaymentAmount, //e.g. 5000
        //  currency: 'AUD'
        //},
        //last_payment_info
        count_per_period: '1',
        //point_in_time: 'Adhoc',
        frequency:
          paymentType === PaymentType.INSTALLMENTS
            ? PaymentTermFrequency.MNTHLY
            : payToMap[task.paymentFrequency as PaymentFrequency],
      },
    },
  };

  if (task.paymentFrequency === PaymentFrequency.ONCE) {
    // scheduledAt + 2 days
    params.agreement_info.validity_end_date = DateTime.fromISO(scheduledAt)
      .plus({ days: 2 })
      .toFormat('yyyy-MM-dd');
  }

  return params;
};

const payToMap: Record<PaymentFrequency, PaymentTermFrequency> = {
  [PaymentFrequency.ONCE]: PaymentTermFrequency.ADHOC,
  [PaymentFrequency.WEEKLY]: PaymentTermFrequency.WEEKLY,
  [PaymentFrequency.FORTNIGHTLY]: PaymentTermFrequency.FRTNLY,
  [PaymentFrequency.MONTHLY]: PaymentTermFrequency.MNTHLY,
  [PaymentFrequency.QUARTERLY]: PaymentTermFrequency.QURTLY,
  [PaymentFrequency.ANNUALLY]: PaymentTermFrequency.YEARLY,
};

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('ctx received: ', JSON.stringify(ctx));
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { accountNumber, bsb, entityId, billPayments, description } =
    ctx.arguments.input;

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  const ip = sourceIp[0];
  console.log('ip: ', ip);
  console.log('claims.phone: ', claims.phone_number);

  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId,
      userId: sub,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  let entityPayer;
  try {
    entityPayer = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
    console.log('entity: ', entityPayer);
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  validateEntityTo(entityPayer);

  // list tasks from batch get using billIds
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

  // create agreement per task
  const payToAgreementRecords = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );
    console.log('task: ', task);
    console.log('taskPayment: ', taskPayment);

    let entityPayee;
    try {
      entityPayee = await getRecord(TABLE_ENTITY ?? '', { id: task.fromId });
      console.log('entityPayee: ', entityPayee);
    } catch (err: any) {
      console.log('ERROR get entityPayee: ', err);
      throw new Error(err.message);
    }
    // create zai validate pay to agreement function
    const agreement = generatePayToParams({
      entityPayer,
      entityPayee,
      description,
      bsb,
      accountNumber,
      task,
      paymentType: taskPayment.paymentType,
      installments: taskPayment.installments,
      scheduledAt: taskPayment.scheduledAt,
    });

    console.log('validate agreement params: ', JSON.stringify(agreement));

    let zaiValidatedPayToAgreement;
    try {
      zaiValidatedPayToAgreement = await validatePayToAgreement(
        zaiAuthToken?.access_token,
        agreement
      );
      console.log(
        'Zai validated PayTo Agreement: ',
        JSON.stringify(zaiValidatedPayToAgreement)
      );
    } catch (err: any) {
      console.log('ERROR validatePayToAgreement: ', err);
      throw new Error(err.message);
    }

    const amount = getTaskPaymentAmount({
      amount: task.amount as number,
      installments: taskPayment.installments,
      isFirstInstallment: false,
      isTaxBill: false, //TODO: PayTo is parked, need to handle tax bill if activated
    });

    const payToAgreementRecord = {
      id: zaiValidatedPayToAgreement.agreement_uuid,
      compositeId: `${entityPayer.id}#${entityPayee.id}#${task.paymentFrequency}`,
      agreementUuid: zaiValidatedPayToAgreement.agreement_uuid, //TODO: is necessary? as id is same
      entityId,
      fromId: task.fromId,
      paymentFrequency: task.paymentFrequency,
      amount,
      status: zaiValidatedPayToAgreement.status,
      createdAt: getIsoDateFromZaiDate(zaiValidatedPayToAgreement.created_at),
      updatedAt: getIsoDateFromZaiDate(zaiValidatedPayToAgreement.updated_at),
    };

    console.log('payToAgreementRecord: ', payToAgreementRecord);

    try {
      await createRecord(TABLE_PAYTO_AGREEMENT ?? '', payToAgreementRecord);
    } catch (err: any) {
      console.log('ERROR create payToAgreementRecord: ', err);
      throw new Error(err.message);
    }

    payToAgreementRecords.push({
      ...payToAgreementRecord,
      from: entityPayee,
    });

    // update each task record to match agreement associated with it //TODO: review if should be done elsewhere
    const updateTaskParams = {
      agreementUuid: payToAgreementRecord.id,
      updatedAt: new Date().toISOString(),
    };
    try {
      const updatedTask = await updateRecord(
        TABLE_TASKS ?? '',
        { entityId: task.entityId, id: task.id },
        updateTaskParams
      );
      console.log('updatedTask: ', updatedTask);
    } catch (err: any) {
      console.log('ERROR update task: ', err);
      throw new Error(err.message);
    }
  }

  return payToAgreementRecords;
};
