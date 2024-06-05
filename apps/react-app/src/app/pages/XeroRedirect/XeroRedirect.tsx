import { gql, useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import {
  xeroCreateTokenSet as XERO_CREATE_TOKEN_SET,
  XeroScopeSet,
} from '@admiin-com/ds-graphql';
import { WBTypography } from '@admiin-com/ds-web';
import { Auth } from 'aws-amplify';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useClientContext } from '../../components/ApolloClientProvider/ApolloClientProvider';
import { configureAppSyncClient } from '../../helpers/appsync';

/* eslint-disable-next-line */
export interface XeroRedirectProps {}

export function XeroRedirect(props: XeroRedirectProps) {
  const { output } = useClientContext();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  console.log('code: ', searchParams.get('code'));
  console.log('session_state: ', searchParams.get('session_state'));
  console.log('scope: ', searchParams.get('scope'));
  console.log('error: ', searchParams.get('error'));
  const [xeroCreateTokenSet] = useMutation(gql(XERO_CREATE_TOKEN_SET), {});

  const errorCode = searchParams.get('error');

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        console.log('authUser: ', authUser);
      } catch (err) {
        console.log('ERROR Auth.currentAuthenticatedUser: ', err);
      }
    };

    getAuthUser();
  }, []);

  useEffect(() => {
    const createTokenSet = async () => {
      let user;
      try {
        user = await Auth.currentAuthenticatedUser({ bypassCache: true });
      } catch (err) {
        console.log('ERROR refresh user session: ', err);
      }

      console.log('user: ', user);

      const url = window.location.href;
      const options: OperationVariables = {
        variables: {
          input: {
            url,
            scopeSet: XeroScopeSet.ACCOUNTING,
          },
        },
      };

      if (!user) {
        options.client = configureAppSyncClient({
          authType: 'API_KEY',
          graphQLAPIURL: output.graphQLAPIURL,
        });
      }

      try {
        const { data } = await xeroCreateTokenSet(options);

        console.log('data: ', data);
      } catch (err) {
        console.log('ERROR create xero token set', err);
      }
    };

    createTokenSet();
  }, [xeroCreateTokenSet]);

  // const createTokenSet = async () => {
  //   try {
  //     const url = window.location.href;
  //     const { data } = await xeroCreateTokenSet({
  //       variables: {
  //         input: {
  //           url,
  //         },
  //       },
  //     });

  //     console.log('data: ', data);
  //   } catch (err) {
  //     console.log('ERROR create xero token set', err);
  //   }
  // };

  return (
    <>
      <WBTypography>Xero redirected</WBTypography>
      {errorCode && (
        <WBTypography color="error">
          {t('xeroError', { ns: 'xero' })} ({errorCode})
        </WBTypography>
      )}
      {/*{!errorCode && <WBButton onClick={createTokenSet}>Create token set</WBButton> }*/}
    </>
  );
}

export default XeroRedirect;
