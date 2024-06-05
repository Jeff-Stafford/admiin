import { IMG_LOGO_FULL, IMG_LOGO_SMALL } from '@admiin-com/ds-common';
import { Auth } from 'aws-amplify';
import React, { useEffect, useMemo } from 'react';
import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { WBResponsiveDrawer } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { isLoggedInVar, subInVar, userTypeInVar } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  CSIsLoggedIn as IS_LOGGED_IN,
  CSGetUserType as GET_USER_TYPE,
} from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
//import { AvatarMenu } from '../AvatarMenu/AvatarMenu';

export const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [getUser] = useLazyQuery(gql(GET_USER));
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const { data: userTypeInData } = useQuery(gql(GET_USER_TYPE));
  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);
  const userType = useMemo(() => userTypeInData?.userType, [userTypeInData]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const curUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        if (curUser?.attributes?.sub) {
          localStorage.setItem('sub', curUser.attributes.sub as string);
          subInVar(curUser.attributes.sub);
          userTypeInVar(
            curUser?.signInUserSession?.accessToken?.payload?.[
              'cognito:groups'
            ]?.[0] || null
          );

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
        userTypeInVar(null);
        client.cache.evict({ fieldName: 'me' });
        client.cache.gc();
      }

      if (isLoggedIn === false) {
        navigate(PATHS.signIn, { replace: true });
      }
    };

    checkUserSession();
  }, [client, getUser, isLoggedIn, navigate]);

  const paths = useMemo(() => {
    const menuItems = [
      {
        to: PATHS.dashboard,
        title: t('dashboardTitle', { ns: 'backoffice' }),
        icon: 'Home',
      },
      {
        to: PATHS.users,
        title: t('usersTitle', { ns: 'backoffice' }),
        icon: 'People',
      },
      {
        to: PATHS.notifications,
        title: t('notificationsTitle', { ns: 'backoffice' }),
        icon: 'Send',
      },
    ];

    if (userType === 'SuperAdmins') {
      return menuItems.concat([
        {
          to: PATHS.admins,
          title: t('adminsTitle', { ns: 'backoffice' }),
          icon: 'ShieldCheckmark',
        },
        {
          to: PATHS.tags,
          title: t('optionsTitle', { ns: 'backoffice' }),
          icon: 'Pricetags',
        },
        {
          to: PATHS.translations,
          title: t('translationsTitle', { ns: 'backoffice' }),
          icon: 'Earth',
        },
      ]);
    }

    return menuItems;
  }, [userType, t]);

  //TODO: resolve - this causes issues
  //if (!isLoggedIn) {
  //  return <Navigate to="/" replace />;
  //}

  const drawerWidth = 250;

  return (
    <WBResponsiveDrawer
      paths={paths}
      drawerWidth={drawerWidth}
      //navRight={<AvatarMenu />}
      logoFullSrc={IMG_LOGO_FULL}
      logoIconSrc={IMG_LOGO_SMALL}
    >
      <Outlet />
    </WBResponsiveDrawer>
  );
};
