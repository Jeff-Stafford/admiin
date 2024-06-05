import { gql, useApolloClient, useQuery } from '@apollo/client';
import {
  WBBox,
  WBIcon,
  WBIconButton,
  WBListItemIcon,
  WBMenu,
  WBMenuItem,
  WBTooltip,
} from '@admiin-com/ds-web';
import { PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Auth, Cache } from 'aws-amplify';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { Link } from '../Link/Link';

type SettingsPath = {
  to?: string;
  title: string;
  onClick?: () => void;
  icon: string;
};

export const AvatarMenu = () => {
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData, loading: userLoading } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
  });

  const user = useMemo(() => userData?.getUser || {}, [userData]);
  // const billing = useMemo(() => userData?.getUser?.billing || {}, [userData]);
  const [userElAnchor, setUserElAnchor] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const client = useApolloClient();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    !userLoading && setUserElAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserElAnchor(null);
  };

  const onLogOut = useCallback(async () => {
    client.cache.evict({ fieldName: 'me' });
    client.cache.gc();

    try {
      localStorage.removeItem('sub');
      await Cache.clear();
      await Auth.signOut();
      isLoggedInVar(false);
    } catch (err) {
      console.log('ERROR log out: ', err);
    }
  }, [client]);

  const settingsPaths: SettingsPath[] = useMemo(
    () => [
      {
        to: `${PATHS.user}/${user.id}`,
        title: user.firstName
          ? `${user.firstName} ${user.lastName}`
          : t('yourProfile', { ns: 'common' }),
        icon: 'Person',
      },
      {
        to: PATHS.account,
        title: t('settingsTitle', { ns: 'common' }),
        icon: 'Settings',
      },
      {
        onClick: async () => await onLogOut(),
        title: t('logOut', { ns: 'common' }),
        icon: 'LogOut',
      },
    ],
    [onLogOut, user, t]
  );

  const renderMenuButton = (setting: SettingsPath) => (
    <WBMenuItem onClick={setting.onClick} key={setting.title}>
      <WBListItemIcon>
        <WBIcon name={setting.icon} size="small" />
      </WBListItemIcon>
      {setting.title}
    </WBMenuItem>
  );

  const renderMenuLink = (setting: SettingsPath) =>
    setting.to && (
      <Link
        to={setting.to}
        key={setting.title}
        underline="none"
        sx={{ color: 'text.primary' }}
      >
        <WBMenuItem onClick={handleCloseUserMenu}>
          <WBListItemIcon>
            <WBIcon name={setting.icon} size="small" />
          </WBListItemIcon>
          {setting.title}
        </WBMenuItem>
      </Link>
    );

  return (
    <WBBox sx={{ flexGrow: 0 }}>
      <WBTooltip title="Your profile">
        <WBIconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <WBS3Avatar
            imgKey={user?.profileImg?.key}
            identityId={user?.profileImg?.identityId}
            level={user?.profileImg?.level}
            src={PROFILE_PLACEHOLDER}
          />
        </WBIconButton>
      </WBTooltip>
      <WBMenu
        sx={{ mt: '45px' }}
        anchorEl={userElAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(userElAnchor)}
        onClose={handleCloseUserMenu}
      >
        {settingsPaths.map((setting) =>
          setting.to ? renderMenuLink(setting) : renderMenuButton(setting)
        )}
      </WBMenu>
    </WBBox>
  );
};
