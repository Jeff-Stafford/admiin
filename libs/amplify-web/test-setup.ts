import { Amplify } from 'aws-amplify';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  Amplify.configure({
    aws_project_region: 'us-east-1',
    aws_appsync_graphqlEndpoint:
      'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    aws_appsync_region: 'us-east-1',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    //aws_cloud_logic_custom: [
    //  {
    //    name: 'AppRestAPI',
    //    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
    //    region: 'us-east-1',
    //  },
    //],
    aws_cognito_identity_pool_id:
      'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    aws_cognito_region: 'us-east-1',
    aws_user_pools_id: 'us-east-1_xxxxxxxxx',
    aws_user_pools_web_client_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    oauth: {},
    aws_cognito_username_attributes: ['EMAIL', 'PHONE_NUMBER'],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: [],
    aws_cognito_mfa_configuration: 'OPTIONAL',
    aws_cognito_mfa_types: ['SMS', 'OTP'],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: [
        'REQUIRES_LOWERCASE',
        'REQUIRES_UPPERCASE',
        'REQUIRES_NUMBERS',
        'REQUIRES_SYMBOLS',
      ],
    },
    aws_cognito_verification_mechanisms: ['EMAIL'],
    aws_user_files_s3_bucket: 'xxxxxx-xxxxx-xxx',
    aws_user_files_s3_bucket_region: 'us-east-1',
  });
});
