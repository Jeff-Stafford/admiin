import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
//import Backend from 'i18next-http-backend';
//import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// import cdkOutput from '../output.json';
import authentication_en from '../../../../react-app/src/app/i18n/languages/en/authentication.json';
import backoffice_en from '../../../../react-app/src/app/i18n/languages//en/backoffice.json';
import common_en from '../../../../react-app/src/app/i18n/languages//en/common.json';
import conversations_en from '../../../../react-app/src/app/i18n/languages//en/conversations.json';
import interests_en from '../../../../react-app/src/app/i18n/languages//en/interests.json';
import onboarding_en from '../../../../react-app/src/app/i18n/languages//en/onboarding.json';
import options_en from '../../../../react-app/src/app/i18n/languages//en/options.json';
import permissions_en from '../../../../react-app/src/app/i18n/languages//en/permissions.json';
import products_en from '../../../../react-app/src/app/i18n/languages//en/products.json';
import purchase_en from '../../../../react-app/src/app/i18n/languages//en/purchase.json';
import signIn_en from '../../../../react-app/src/app/i18n/languages//en/signIn.json';
import signUp_en from '../../../../react-app/src/app/i18n/languages//en/signUp.json';
import team_en from '../../../../react-app/src/app/i18n/languages//en/team.json';
import translations_en from '../../../../react-app/src/app/i18n/languages//en/translations.json';
import user_en from '../../../../react-app/src/app/i18n/languages//en/user.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const resources = {
  en: {
    authentication: authentication_en,
    backoffice: backoffice_en,
    common: common_en,
    conversations: conversations_en,
    interests: interests_en,
    onboarding: onboarding_en,
    options: options_en,
    permissions: permissions_en,
    products: products_en,
    purchase: purchase_en,
    signIn: signIn_en,
    signUp: signUp_en,
    team: team_en,
    translations: translations_en,
    user: user_en,
  },
};

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      returnNull: false,
      load: 'languageOnly',
      fallbackLng: 'en',
      preload: ['en'],
      ns: [
        'authentication',
        'common',
        'conversations',
        'interests',
        'onboarding',
        'options',
        'permissions',
        'purchase',
        'products',
        'signIn',
        'signUp',
        'team',
        'translations',
        'user',
      ],
      //backend: {
      //  backends: [LocalStorageBackend, Backend],
      //  backendOptions: [
      //    {
      //      expirationTime: 1 * 24 * 60 * 60 * 1000, // 1 day
      //    },
      //    {
      //      loadPath: `https://${
      //        cdkOutput.APPMediaStorageStack.MediaBucketName
      //      }.s3.amazonaws.com/translations/{{lng}}/{{ns}}.json?cb=${new Date().getTime()}`,
      //      crossDomain: true,
      //    },
      //  ],
      //},
      cache: ['localStorage'],
      debug: false,
      saveMissing: false,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      react: {
        useSuspense: true,
      },
      resources, // translations served from local file directory
    },
    (err) => {
      if (err) {
        console.error('err i18n', err);
      }
    }
  );

export { i18n };
