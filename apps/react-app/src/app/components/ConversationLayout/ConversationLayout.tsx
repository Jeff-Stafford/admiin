import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { WBBox, WBFlex, WBIconButton, WBTypography } from '@admiin-com/ds-web';
import { Auth } from 'aws-amplify';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
// import { UserType } from '@admiin-com/ds-graphql';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { ConversationList } from '../../pages/Conversations/ConversationList';
import { AvatarMenu } from '../AvatarMenu/AvatarMenu';
import { ChangeLanguage } from '../ChangeLanguage/ChangeLanguage';
import { NavBar } from '../NavBar/NavBar';

export const ConversationLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [getUser] = useLazyQuery(gql(GET_USER));
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));

  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);
  // const user = useMemo(() => userData?.getUser || {}, [userData]);

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

  const getHomePath = () => {
    return '/';
  };

  return (
    <WBBox>
      <NavBar
        homePath={getHomePath()}
        navRight={
          <WBFlex alignItems="flex-end">
            <WBIconButton
              library="ioniconSolid"
              icon="Albums"
              onClick={() => !!getHomePath() && navigate(getHomePath())}
            />
            <WBBox mr={2} />
            <ChangeLanguage />
            <WBBox mr={2} />
            <AvatarMenu />
          </WBFlex>
        }
      />
      <WBFlex>
        <WBFlex
          flex={1}
          flexDirection="column"
          sx={{
            height: 'calc(100vh - env(safe-area-inset-bottom) - 64px)', //calc(100vh - env(safe-area-inset-bottom)) //calc(100vh - 64px)
            overflow: 'hidden',
            borderRight: '1px solid lightgrey',
            minWidth: 0,
          }}
        >
          <WBFlex
            sx={{ borderBottom: '1px solid lightgrey' }}
            height="73px"
            //height="87px"
            alignItems="center"
          >
            <WBTypography variant="h3" m={0} ml={3}>
              {t('chatsTitle', { ns: 'conversations' })}
            </WBTypography>
          </WBFlex>
          <ConversationList />
        </WBFlex>
        <WBFlex
          flexDirection="column"
          component="main"
          flex={2}
          sx={{
            height: 'calc(100vh - 64px)',
            overflowY: 'scroll',
          }}
        >
          <Outlet />
        </WBFlex>
      </WBFlex>
    </WBBox>
  );
};
