import {
  BatchTransactionResponse,
  GetBatchTransactionItemResponse,
} from '/opt/zai/batchTransactions.types';
const { ZAI_DOMAIN } = process.env;

export const getBatchTransaction = async (
  zaiAuthToken: string,
  batchTransactionId: string
): Promise<BatchTransactionResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/batch_transactions/${batchTransactionId}`,
    options
  );

  if (!response.ok) {
    console.log('ERROR getBatchTransaction: ', JSON.stringify(response));
    throw new Error(`ERROR getBatchTransaction: ${response.status}`);
  }

  return response.json();
};

export const getBatchTransactionItem = async (
  zaiAuthToken: string,
  batchTransactionId: string
): Promise<GetBatchTransactionItemResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/batch_transactions/${batchTransactionId}/items`,
    options
  );

  if (!response.ok) {
    console.log('ERROR getBatchTransactionItem: ', JSON.stringify(response));
    throw new Error(`ERROR getBatchTransactionItem: ${response.status}`);
  }

  return response.json();
};
