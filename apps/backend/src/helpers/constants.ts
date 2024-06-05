import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

import { setEnvVar } from './setEnvVar';

const {
  ENV,
  FRANKIEONE_API_KEY,
  FRANKIEONE_API_DOMAIN,
  FRANKIEONE_CUSTOMER_ID,
  FRANKIEONE_SMARTUI_DOMAIN,
  APPLE_BUNDLE_ID,
  GOOGLE_BUNDLE_ID,
  //GOOGLE_PLACES_API_KEY,
  MIXPANEL_TOKEN,
  APPLE_CONNECT_KEY,
  APPLE_CONNECT_KEY_ID,
  APPLE_CONNECT_ISSUER_ID,
  AWS_ACCOUNT,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
  XERO_WEBHOOK_SECRET,
  ABR_GUID,
  ZAI_DOMAIN,
  ZAI_TOKEN_DOMAIN,
  ZAI_WEBHOOK_DOMAIN,
  ZAI_CLIENT_ID,
  ZAI_CLIENT_SCOPE,
} = process.env;

const appPrefix = setEnvVar('ADM');
const env = setEnvVar(ENV);
const isProd = env === 'prod';
const account = setEnvVar(AWS_ACCOUNT);
const apiId = `${appPrefix}ApiId`;
const apiName = `${appPrefix}GraphqlAPI-${env}`;
const appName = setEnvVar('Admiin');
const domain = setEnvVar('admiin.com');
const companyName = setEnvVar('Admiin');
const createUserFuncName = `${appPrefix}AuthStack-createUserFunc-${env}`;
const frankieOneApiKey = setEnvVar(FRANKIEONE_API_KEY);
const frankieOneApiDomain = setEnvVar(FRANKIEONE_API_DOMAIN);
const frankieOneCustomerId = setEnvVar(FRANKIEONE_CUSTOMER_ID);
const frankieOneSmartUiDomain = setEnvVar(FRANKIEONE_SMARTUI_DOMAIN);
const fromEmail = setEnvVar('hello@admiin.com');
const replyToEmail = setEnvVar('hello@admiin.com');
const appleBundleId = setEnvVar(APPLE_BUNDLE_ID);
const googleBundleId = setEnvVar(GOOGLE_BUNDLE_ID);
const hostedZoneId = setEnvVar('Z04416773PYDOIMA6UQ73');
const mixpanelToken = setEnvVar(MIXPANEL_TOKEN);
const appleConnectKey = setEnvVar(APPLE_CONNECT_KEY);
const appleConnectKeyId = setEnvVar(APPLE_CONNECT_KEY_ID);
const appleConnectIssuerId = setEnvVar(APPLE_CONNECT_ISSUER_ID);
const region = setEnvVar('us-east-1');
const transactionalEmailDomain = setEnvVar('admiin.com');
const xeroClientId = setEnvVar(XERO_CLIENT_ID);
const xeroClientSecret = setEnvVar(XERO_CLIENT_SECRET);
const xeroWebhookSecret = setEnvVar(XERO_WEBHOOK_SECRET);
const abrGuid = setEnvVar(ABR_GUID);
const restApiName = `${appPrefix}RESTAPI-${env}`;
const apiDomainName = isProd ? `api.${domain}` : `api-${env}.${domain}`;
const webDomainName = isProd ? `app.${domain}` : `app-${env}.${domain}`;
const backofficeDomainName = isProd
  ? `backoffice.${domain}`
  : `backoffice-${env}.${domain}`;
const restApiDomainName = isProd
  ? `restapi.${domain}`
  : `restapi-${env}.${domain}`;
const zaiDomain = setEnvVar(ZAI_DOMAIN);
const zaiTokenDomain = setEnvVar(ZAI_TOKEN_DOMAIN);
const zaiWebhookDomain = setEnvVar(ZAI_WEBHOOK_DOMAIN);
const zaiClientId = setEnvVar(ZAI_CLIENT_ID);
const zaiClientScope = setEnvVar(ZAI_CLIENT_SCOPE);
const zaiEnv = isProd ? 'prod' : 'dev';
const frankieOneEnv = isProd ? 'prod' : 'dev';

export {
  abrGuid,
  account,
  apiId,
  apiName,
  apiDomainName,
  appleBundleId,
  appleConnectKey,
  appleConnectKeyId,
  appleConnectIssuerId,
  appName,
  appPrefix,
  backofficeDomainName,
  companyName,
  createUserFuncName,
  domain,
  env,
  frankieOneEnv,
  frankieOneApiKey,
  frankieOneApiDomain,
  frankieOneSmartUiDomain,
  frankieOneCustomerId,
  fromEmail,
  googleBundleId,
  hostedZoneId,
  isProd,
  replyToEmail,
  mixpanelToken,
  restApiName,
  restApiDomainName,
  region,
  transactionalEmailDomain,
  webDomainName,
  xeroClientId,
  xeroClientSecret,
  xeroWebhookSecret,
  zaiDomain,
  zaiEnv,
  zaiTokenDomain,
  zaiWebhookDomain,
  zaiClientId,
  zaiClientScope,
};
