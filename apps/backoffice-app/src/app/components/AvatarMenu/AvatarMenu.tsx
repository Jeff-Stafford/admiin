import { useApolloClient } from '@apollo/client';
import {
  WBBox,
  WBIcon,
  WBIconButton,
  WBListItemIcon,
  WBMenu,
  WBMenuItem,
  WBTooltip,
} from '@admiin-com/ds-web';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { Auth, Cache } from 'aws-amplify';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { Link } from '../Link/Link';

type SettingsPath = {
  to?: string;
  title: string;
  onClick?: () => void;
  icon: string;
};

export const AvatarMenu = () => {
  const client = useApolloClient();
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
        to: PATHS.settings,
        title: t('settingsTitle', { ns: 'common' }),
        icon: 'Settings',
      },
      {
        onClick: onLogOut,
        title: t('logOut', { ns: 'common' }),
        icon: 'LogOut',
      },
    ],
    [onLogOut, t]
  );

  const renderMenuButton = (setting: SettingsPath) => (
    <WBMenuItem onClick={setting.onClick} key={setting.title}>
      <WBListItemIcon>
        <WBIcon name={setting.icon} size="small" />
      </WBListItemIcon>
      {setting.title}
    </WBMenuItem>
  );

  const renderMenuLink = (setting: SettingsPath) => (
    <Link
      //@ts-ignore
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
        <WBBox>
          <WBIconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <WBS3Avatar src={PROFILE_PLACEHOLDER} />
          </WBIconButton>
        </WBBox>
      </WBTooltip>
      <WBMenu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settingsPaths.map((setting) =>
          setting.to ? renderMenuLink(setting) : renderMenuButton(setting)
        )}
      </WBMenu>
    </WBBox>
  );
};
