// import { gql, useMutation } from '@apollo/client';
// import {
//   xeroCreateConsentUrl as XERO_CREATE_CONSENT_URL,
//   XeroScopeSet,
// } from '@admiin-com/ds-graphql';
import { WBButton } from '@admiin-com/ds-web';
import { Auth } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
// import { configureAppSyncClient } from '../../helpers/appsync';

console.log('Auth: ', Auth);

export function SignUpXero() {
  const { t } = useTranslation();
  // const [xeroCreateConsentUrl] = useMutation(gql(XERO_CREATE_CONSENT_URL), {
  //   client: configureAppSyncClient({ authType: 'API_KEY' }),
  // });

  // const onSignUpXero = async () => {
  //   try {
  //     const { data } = await xeroCreateConsentUrl({
  //       variables: {
  //         scopeSet: XeroScopeSet.PROFILE,
  //       },
  //     });
  //     if (data?.xeroCreateConsentUrl) {
  //       window.location.replace(data?.xeroCreateConsentUrl);
  //     }
  //   } catch (err) {
  //     console.log('ERROR create xero token set', err);
  //   }
  // };

  const onSignUpClick = async () => {
    try {
      await Auth.federatedSignIn({
        customProvider: 'Xero',
      });
    } catch (err) {
      console.log('Xero error', err);
    }
  };

  return (
    <WBButton
      //onClick={onSignUpXero}
      onClick={onSignUpClick}
      sx={{
        backgroundColor: '#13B5EA',
        '&:hover': {
          backgroundColor: '#13B5EA',
          opacity: 0.5,
        },
      }}
    >
      {t('signUpXero', { ns: 'authentication' })}
    </WBButton>
  );
}

export default SignUpXero;
