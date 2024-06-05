import { LOGO_LARGE_ADMIIN, LOGO_ICON_ADMIIN } from '@admiin-com/ds-common';
import { Auth } from 'aws-amplify';
import React, { Suspense, useEffect, useMemo } from 'react';
import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { Outlet, useNavigate } from 'react-router-dom';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { useNotificationService } from '../../hooks/useNotificationService/useNotificationService';
import { SidebarLayout } from '../SidebarLayout/SidebarLayout';
import ConfirmPaymentsDlg from '../../pages/ConfirmPaymentsDlg/ConfirmPaymentsDlg';

export const DrawerLayout = () => {
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
  }, [client, getUser, isLoggedIn, navigate]);

  useNotificationService();

  const drawerWidth = 200;
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <SidebarLayout
      drawerWidth={drawerWidth}
      logoFullSrc={LOGO_LARGE_ADMIIN}
      logoIconSrc={LOGO_ICON_ADMIIN}
    >
      <Suspense fallback={<div></div>}>
        <Outlet />
      </Suspense>
      <ConfirmPaymentsDlg open={open} onClose={() => setOpen(false)} />
    </SidebarLayout>
  );
};
