import { createZaiAuthToken, isAuthTokenExpired } from '/opt/zai/auth';
import { CreateZaiAuthTokenResponse } from '/opt/zai/auth.types';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { DateTime } from 'luxon';

const { ENV, REGION } = process.env;
const secretManager = new SecretsManagerClient({ region: REGION });
const isProd = ENV === 'prod';

export interface ZaiMeta {
  total: number;
  limit: number;
  offset: number;
}

interface InitZai {
  zaiAuthToken: CreateZaiAuthTokenResponse;
  zaiClientSecret: string;
  zaiWebhookSecret?: string;
}

export const initZai = async ({
  zaiAuthToken,
  zaiClientSecret,
  zaiWebhookSecret,
}: InitZai) => {
  const zaiEnv = isProd ? 'prod' : 'dev';

  // get secret from aws secrets manager after init from aws-sdk v3
  try {
    const response = await secretManager.send(
      new GetSecretValueCommand({ SecretId: `ZaiSecrets-${zaiEnv}` })
    );

    // access zaiClientSecret from secret
    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString);
      zaiClientSecret = secrets.zaiClientSecret;
      zaiWebhookSecret = secrets.zaiWebhookSecret;
    }
  } catch (err: any) {
    console.log('ERROR get secret: ', err);
    throw new Error(err.message);
  }

  // create new auth token if expired
  if (isAuthTokenExpired(zaiAuthToken)) {
    try {
      zaiAuthToken = await createZaiAuthToken({ zaiClientSecret });
    } catch (err: any) {
      console.log('ERROR createZaiAuthToken: ', err);
      throw new Error(err.message);
    }
  }

  return {
    zaiAuthToken,
    zaiClientSecret,
    zaiWebhookSecret: zaiWebhookSecret ?? '',
  };
};

export const getIsoDateFromZaiDate = (zaiDate: string) => {
  //date time from sql and utc to iso date
  return DateTime.fromSQL(zaiDate, { zone: 'utc' }).toISO();
};
