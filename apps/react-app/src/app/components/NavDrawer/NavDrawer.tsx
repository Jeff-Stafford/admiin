import {
  WBBox,
  WBButton,
  WBDivider,
  WBFlex,
  WBIcon,
  WBList,
  WBToolbar,
  useMediaQuery,
  useTheme,
} from '@admiin-com/ds-web';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import TemplatesIcon from '../../../assets/icons/templates.svg';
import ToolBoxIcon from '../../../assets/icons/taskbox.svg';
import UserIcon from '../../../assets/icons/contacts.svg';
import ClientsIcon from '../../../assets/icons/clients.svg';
import StarIcon from '../../../assets/icons/star.svg';
import SettingIcon from '../../../assets/icons/setting.svg';
import { PATHS } from '../../navigation/paths';
import { EntitySelector } from '../EntitySelector/EntitySelector';
import { TaskCreation } from '../../pages/TaskCreation/TaskCreation';
import React from 'react';
import { NavItem } from '../NavItem/NavItem';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../hooks/useTasks/useTasks';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { useUserEntities } from '../../hooks/useUserEntities/useUserEntities';
/* eslint-disable-next-line */
export interface NavDrawerProps {
  logo: React.ReactNode;
  onNavigated?: () => void;
}

export function NavDrawer({ logo, onNavigated }: NavDrawerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpenModal] = React.useState<boolean>(false);
  const { entity } = useSelectedEntity();

  const { hasDeclinedPayment } = useTasks();

  const { users: clients } = useUserEntities({ onlyAccountant: true });
  const hasClients = entity?.clientsEnabled || clients?.length > 0;

  return (
    <WBBox
      sx={{
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 2,
      }}
    >
      <WBToolbar sx={{ py: 4, mx: 1, justifyContent: 'start' }}>
        {logo}
      </WBToolbar>
      <WBList>
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('dashboardTitle', { ns: 'common' })}
          icon={<DashboardIcon />}
          path={PATHS.dashboard}
        />
      </WBList>
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <WBList sx={{ flexGrow: 1, marginTop: 2 }}>
        <EntitySelector />
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={
            <WBFlex alignItems={'center'}>
              {t('taskboxTitle', { ns: 'common' })}
              {hasDeclinedPayment && (
                <WBBox
                  ml={1}
                  borderRadius="100%"
                  width="10px"
                  height="10px"
                  bgcolor="error.main"
                />
              )}
            </WBFlex>
          }
          icon={<ToolBoxIcon />}
          path={PATHS.taskBox}
        />
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('contactsTitle', { ns: 'common' })}
          icon={<UserIcon />}
          path={PATHS.contacts}
        />
        {hasClients ? (
          <NavItem
            onClick={() => {
              onNavigated && onNavigated();
            }}
            title={t('clientsTitle', { ns: 'common' })}
            icon={<ClientsIcon />}
            path={PATHS.clients}
          />
        ) : null}
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('templatesTitle', { ns: 'common' })}
          icon={<TemplatesIcon />}
          path={PATHS.templates}
        />
      </WBList>
      <WBBox>
        <WBButton
          sx={{
            marginLeft: 3,
            marginBottom: 4,
            p: 0.8,
            pr: 2,
            minWidth: '40px',
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
          }}
          onClick={() => setOpenModal(true)}
        >
          <WBIcon name="Add" color="inherit" size="small" />
          <WBBox ml={1}>Create Task</WBBox>
        </WBButton>
      </WBBox>
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <WBList>
        {/*<NavItem*/}
        {/*  title={`xx,xxx ${t('pointsTitle', { ns: 'common' })}`}*/}
        {/*  icon={<StarIcon />}*/}
        {/*  path={PATHS.rewards}*/}
        {/*/>*/}
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('settingsTitle', { ns: 'common' })}
          icon={<SettingIcon />}
          path={!islg ? PATHS.account : PATHS.settings}
        />
      </WBList>
      <TaskCreation
        open={open}
        handleCloseModal={() => setOpenModal(false)}
        key={open as any}
      />
    </WBBox>
  );
}

export default NavDrawer;
