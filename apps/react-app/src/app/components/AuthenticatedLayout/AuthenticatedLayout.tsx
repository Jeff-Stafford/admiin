//import { IMG_LOGO_FULL, IMG_LOGO_SMALL } from '@admiin-com/ds-common';
//import { SortableContext } from '@dnd-kit/sortable';
import { Auth } from 'aws-amplify';
import React, { useEffect, useMemo } from 'react';
import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { Outlet, useNavigate } from 'react-router-dom';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

export const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [getUser] = useLazyQuery(gql(GET_USER));
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const curUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        if (curUser?.attributes?.sub) {
          localStorage.setItem('sub', curUser.attributes.sub as string);
          subInVar(curUser.attributes.sub);

          //curUser?.signInUserSession?.accessToken?.payload?.["cognito:groups"]?.[0]

          await getUser({
            variables: {
              id: curUser.attributes.sub,
            },
          });
        }
      } catch (err) {
        console.log('ERROR: Auth.currentAuthenticatedUser', err);
        localStorage.removeItem('sub');
        subInVar(null);
        isLoggedInVar(false);
        client.cache.evict({ fieldName: 'me' });
        client.cache.gc();
      }

      if (isLoggedIn === false) {
        navigate(PATHS.signIn, { replace: true });
      }
    };

    checkUserSession();
  }, [client, getUser, isLoggedIn, navigate]);

  //const drawerWidth = 250;

  return <Outlet />;
};
