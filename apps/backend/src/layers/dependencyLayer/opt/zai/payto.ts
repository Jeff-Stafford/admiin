// https://developer.hellozai.com/docs/simulate-payto-apis-in-pre-live
import {
  GetFailedPayToPaymentResponse,
  GetPayToAgreementResponse,
  PayToAgreementResponse,
  ValidatePayToAgreementRequest,
} from '/opt/zai/payto.types';
//import { DateTime } from 'luxon';

const { ZAI_WEBHOOK_DOMAIN } = process.env;

export const validatePayToAgreement = async (
  zaiAuthToken: string,
  request: ValidatePayToAgreementRequest
): Promise<PayToAgreementResponse> => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
    body: JSON.stringify(request),
  };

  const response = await fetch(
    `${ZAI_WEBHOOK_DOMAIN}/payto/agreements/validate`,
    options
  );
  if (!response.ok) {
    const error = await response.text();
    console.log('error typeof: ', typeof error);
    console.log('ERROR validatePayToAgreement: ', JSON.stringify(error));
    throw new Error(JSON.stringify(error));
  }
  const data = await response.json();
  return {
    ...data,
    //created_at: getIsoDateFromZaiDate(zaiItem.created_at),
    //updated_at: getIsoDateFromZaiDate(zaiItem.updated_at)
  };
};

export const getPayToAgreement = async (
  zaiAuthToken: string,
  agreementId: string
): Promise<GetPayToAgreementResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_WEBHOOK_DOMAIN}/payto/agreements/${agreementId}`,
    options
  );
  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR getPayToAgreement: ', JSON.stringify(error));
    throw new Error(JSON.stringify(error));
  }
  const data = await response.json();
  return {
    ...data,
    //created_at: getIsoDateFromZaiDate(zaiItem.created_at),
    //updated_at: getIsoDateFromZaiDate(zaiItem.updated_at)
  };
};

export const createZaiPayToAgreement = async (
  zaiAuthToken: string,
  agreementId: string
): Promise<PayToAgreementResponse> => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_WEBHOOK_DOMAIN}/payto/agreements/${agreementId}/create`,
    options
  );
  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR createPayToAgreement: ', JSON.stringify(error));
    try {
      const errorJson = JSON.parse(error);
      const errorMessage = errorJson.errors[0].error_message;
      console.log('Error message: ', errorMessage);
    } catch (e) {
      console.log('Error parsing JSON: ', e);
      throw new Error(JSON.stringify(error));
    }
  }
  const data = await response.json();
  return {
    ...data,
    //created_at: getIsoDateFromZaiDate(zaiItem.created_at),
    //updated_at: getIsoDateFromZaiDate(zaiItem.updated_at)
  };
};

export interface InitiatePayToPaymentRequest {
  priority: 'ATTENDED' | 'UNATTENDED';
  payment_info: {
    instructed_amount: string;
    last_payment: boolean;
    end_to_end_id?: string;
    remittance_info?: string;
    unique_superannuation_id?: string;
    unique_superannuation_code?: string;
  };
  retry_info?: {
    payment_request_uuid: string;
  };
}

export interface InitiatePayToPaymentResponse {
  payment_request_uuid: string;
  agreement_uuid: string;
  instruction_id: string;
  status: 'PENDING_PAYMENT_INITIATION' | 'PAYMENT_INITIATION_REJECTED';
  created_at: string;
  updated_at: string;
  agreement_id: string;
}

export const initiatePayToPayment = async (
  zaiAuthToken: string,
  agreementId: string,
  request: InitiatePayToPaymentRequest
): Promise<InitiatePayToPaymentResponse> => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
    body: JSON.stringify(request),
  };

  const response = await fetch(
    `${ZAI_WEBHOOK_DOMAIN}/payto/agreements/${agreementId}/payment_requests/initiate`,
    options
  );

  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR initiatePayToPayment: ', JSON.stringify(error));
    throw new Error(JSON.stringify(error));
  }

  return response.json();
};

export const getFailedPayToPayment = async (
  zaiAuthToken: string,
  instructionId: string
): Promise<GetFailedPayToPaymentResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_WEBHOOK_DOMAIN}/payment_details/failed/${instructionId}`,
    options
  );
  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR getFailedPayToPayment: ', JSON.stringify(error));
    throw new Error(JSON.stringify(error));
  }

  const data = await response.json();
  return {
    ...data,
    //created_at: getIsoDateFromZaiDate(zaiItem.created_at),
    //updated_at: getIsoDateFromZaiDate(zaiItem.updated_at)
  };
};

// PAYMENT_INITIATION_REJECTED reason status codes

export enum PayToPaymentInitiationRejectedReasonCodes {
  ClearingAndSettlementError = 'ClearingAndSettlementError', // An error occurred during clearing and settlement of the payment. Please retry the same payment again or contact Zai support.
  PayeeBankOffline = 'PayeeBankOffline', // Payee institution is offline. Please try again or contact Zai support.
  PayerAccountNumberInvalid = 'PayerAccountNumberInvalid', // Payer account details or PayID provided is invalid or does not exist within NPP. Please update the agreement with correct account details and try again.
  PayeeAccountNumberInvalid = 'PayeeAccountNumberInvalid', // Payee account details provided is invalid or does not exist within NPP. Please try again or contact Zai support.
  PayerAccountClosed = 'PayerAccountClosed', // Payer account provided is closed. Please update the agreement with correct account details and try again.
  InsufficientFunds = 'InsufficientFunds', // Payer account has insufficient funds at the moment. Please contact the payer and retry the same payment again after funds availability.
  BlockedAccount = 'BlockedAccount', // Account provided is temporarily blocked. Please retry the same payment again after some time or contact the payer.
  PayeeAccountClosed = 'PayeeAccountClosed', // Payee account provided is closed. Please try again or contact Zai support.
  PayerAccountTypeInvalid = 'PayerAccountTypeInvalid', // Payer account type is invalid - unable to debit funds within NPP. Please update the agreement with correct account details and try again or contact the payer.
  PayeeAccountTypeInvalid = 'PayeeAccountTypeInvalid', // Payee account type is invalid - unable to credit funds within NPP. Please try again or contact Zai support.
  UnexpectedError = 'UnexpectedError', // Unexpected error occurred while processing the payment initiation request. Please try again or contact Zai support.
  TransactionForbiddenOnPayerAccount = 'TransactionForbiddenOnPayerAccount', // Either the Payer account does not allow debits within NPP or agreement to debit the account is not active. Please update the agreement with correct account details and try again or contact the Payer.
  NPPTransactionNotSupported = 'NPPTransactionNotSupported', // Payee institution has rejected the NPP payment from Payer institution. Please try again or contact Zai support.
  UnspecifiedReason = 'UnspecifiedReason', // Payment initiation request has been rejected by the Payer institution without any specified reason.
  RequestedByPayer = 'RequestedByPayer', // Payment rejection has been requested by the Payer. Please contact the Payer or retry the same payment again.
  UndisclosedReason = 'UndisclosedReason', // Payment has been rejected due to undisclosed reasons.
  RequestedByPayer_UnspecifiedReason = 'RequestedByPayer_UnspecifiedReason', // Payment has been rejected by the Payer without any specified reason. Please retry the same payment again or contact the Payer.
  Prohibited = 'Prohibited', // Payment has been rejected as it is considered prohibited.
  RequestedByPayerBank_UnspecifiedReason = 'RequestedByPayerBank_UnspecifiedReason', // Payment has been rejected by the Payer institution without any specified reason. Please try again or contact the Payer institution.
  PayeeNotOnAllowlistOfPayer = 'PayeeNotOnAllowlistOfPayer', // Payee not on the allowlist/trusted list of the Payer. Please try again or contact the Payer.
  PayeeOnBlocklistOfPayer = 'PayeeOnBlocklistOfPayer', // Payee is blocked/blacklisted by the Payer. Please try again or contact the Payer.
  ExceedsMaxAllowedDirectDebitTransactions = 'ExceedsMaxAllowedDirectDebitTransactions', // The payment request exceeds the maximum number of direct debit transactions allowed on the Payer account. Please retry the same payment again or contact the Payer.
  ExceedsMaxAllowedDirectDebitTransactionAmount = 'ExceedsMaxAllowedDirectDebitTransactionAmount', // The payment amount requested exceeds the maximum amount that can be debited from the Payer account via direct debit. Please retry the same payment again or contact the Payer.
  UnexpectedError_RetrySamePayment = 'UnexpectedError_RetrySamePayment', // Unexpected error occurred while processing the payment initiation request. Please retry the same payment again or contact Zai support.
  PayerUnavailable = 'PayerUnavailable', // Payer institution is unavailable. Please retry the same payment again or contact the Payer.
  InvalidPayerPayID = 'InvalidPayerPayID', // PayID details of the Payer are no longer valid. Please update the agreement with correct details and try again or contact the Payer.
  PayerBSBNotNPPReachable = 'PayerBSBNotNPPReachable', // Payer BSB is not NPP reachable. Please update the agreement with correct details and try again or contact the Payer.
  PayerNotNPPReachable = 'PayerNotNPPReachable', // Payer is no longer reachable on NPP. Please try again or cancel the agreement.
  PayeeNotNPPReachable = 'PayeeNotNPPReachable', // Payee is no longer reachable on NPP. Please try again or contact Zai support.
  IncorrectPayerPayID = 'IncorrectPayerPayID', // PayID details of the Payer are no longer valid as the PayID has been ported incorrectly. Please update the agreement with correct details and try again or contact the Payer.
  NotRetryEligible = 'NotRetryEligible', // Retries are allowed only if the payment has been rejected with retry eligible rejection reasons.
  EndToEndIDInvalidOrMissing = 'EndToEndIDInvalidOrMissing', // EndToEndID is either invalid or missing. Please correct the end to end id and retry the same payment again.
  Non_CompliantPayment = 'Non_CompliantPayment', // Payment amount is not as per the agreed payment terms and conditions. Please correct the amount and retry the same payment again.
  NPPLimitExceeded = 'NPPLimitExceeded', // Payment amount requested exceeds the agreed limits for the Payer account. Please correct the amount and retry the same payment again.
  UnrecognisedInitiatingParty = 'UnrecognisedInitiatingParty', // The Payer has requested the payment rejection as the Initiating party is not recognised by them. Please try again or contact the Payer.
  UnknownPayer = 'UnknownPayer', // The payment has been rejected by the Payer institution as the Payer is not known as per records. Please try again or contact the Payer.
  PayeeBSBNotNPPReachable = 'PayeeBSBNotNPPReachable', // Payee BSB is not NPP reachable. Please try again or contact Zai support.
  PayerNameOrAddressDetailsMissing = 'PayerNameOrAddressDetailsMissing', // Payer name or address details are missing. Please update the agreement with complete Payer details and try again.
  PayeeNameOrAddressDetailsMissing = 'PayeeNameOrAddressDetailsMissing', // Payee name or address details are missing. Please try again or contact Zai support.
  UnknownReason = 'UnknownReason', // Payment has been rejected due to unknown reason.
  PayeeUnavailable = 'PayeeUnavailable', // Payee institution is unavailable. Please retry the same payment again or contact Zai support.
  PayerNameMissing = 'PayerNameMissing', // Payer name is missing. Please update the agreement with complete Payer details and try again.
  PayeeNameMissing = 'PayeeNameMissing', // Payee name is missing in the agreement. Please try again or contact Zai support.
  UnsupportedCurrency = 'UnsupportedCurrency', // Unable to debit funds in AUD from the provided Payer account.
  AmountExceedsMaxNPPLimit = 'AmountExceedsMaxNPPLimit', // Payment amount either exceeds the maximum allowed NPP limit of $99,999,999,999 or maximum allowed NPP limit for the Payer account.
}
