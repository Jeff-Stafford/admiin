import { ThemeOptions, WBDesignSystemProvider } from '@admiin-com/ds-web';
import { MIXPANEL_TOKEN_DEV, SENTRY_DSN } from '@admiin-com/ds-common';
import { Amplify } from 'aws-amplify';
import { darkTheme, theme } from '@admiin-com/ds-design-token';
import mixpanel from 'mixpanel-browser';
import { deepmerge } from 'deepmerge-ts';
import { LinkBehavior } from './components';
import { NavRoutes } from './navigation/NavRoutes';
import * as Sentry from '@sentry/react';
import './i18n';

import cdkOutput from './output.json';

Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_appsync_graphqlEndpoint: cdkOutput?.ADMAppSyncAPIStack?.GraphQLAPIURL,
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  //aws_cloud_logic_custom: [
  //  {
  //    name: 'AppRestAPI',
  //    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
  //    region: 'us-east-1',
  //  },
  //],
  aws_cognito_identity_pool_id: cdkOutput?.ADMAuthStack?.IdentityPoolId,
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: cdkOutput?.ADMAuthStack?.UserPoolId,
  aws_user_pools_web_client_id: cdkOutput?.ADMAuthStack?.UserPoolClientId,
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
  aws_user_files_s3_bucket: cdkOutput?.ADMMediaStorageStack?.MediaBucketName,
  aws_user_files_s3_bucket_region:
    cdkOutput?.ADMMediaStorageStack?.MediaBucketRegion,
});

const commonTheme = {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
  },
};

const appTheme: ThemeOptions = deepmerge(theme, commonTheme);
const appDarkTheme: ThemeOptions = deepmerge(darkTheme, commonTheme);

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  enabled: true, //TODO: enable for staging / production
});

export function App() {
  mixpanel.init(MIXPANEL_TOKEN_DEV, { debug: true, ignore_dnt: true });

  return (
    <WBDesignSystemProvider theme={appTheme} darkTheme={appDarkTheme}>
      <NavRoutes />
    </WBDesignSystemProvider>
  );
}

export default App;
