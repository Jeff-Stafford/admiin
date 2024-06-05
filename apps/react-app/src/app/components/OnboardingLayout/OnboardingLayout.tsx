import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { WBBox } from '@admiin-com/ds-web';
import { Auth } from 'aws-amplify';
import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { BusinessProcessProvider } from '../OnboardingContainer/OnboadringContainer';
export const OnboardingLayout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [getUser] = useLazyQuery(gql(GET_USER));
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);

  // const prePath = useMemo(()=>getNextOnboardingStep)

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const curUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        if (curUser?.attributes?.sub) {
          localStorage.setItem('sub', curUser.attributes.sub as string);

          await getUser({
            variables: {
              id: curUser.attributes.sub,
            },
          });
        }
      } catch (err) {
        console.log('ERROR: Auth.currentAuthenticatedUser', err);
        localStorage.removeItem('sub');
        isLoggedInVar(false);
        client.cache.evict({ fieldName: 'me' });
        client.cache.gc();
      }

      if (isLoggedIn === false) {
        navigate(PATHS.signIn, { replace: true });
      }
    };

    checkUserSession();
  }, [client, navigate, isLoggedIn, getUser]);

  return (
    <WBBox>
      {/* <NavBar homePath={path} navRight={<ChangeLanguage />} /> */}
      <BusinessProcessProvider>
        <Outlet />
      </BusinessProcessProvider>
    </WBBox>
  );
};
