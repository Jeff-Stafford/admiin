import {
  WBBox,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBSideNav,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../navigation/paths';
import { useMediaQuery, useTheme } from '@mui/material';

import { TermsConditionsLink } from './TermsConditionsLink';
import { SidebarLayout } from '../../components/SidebarLayout/SidebarLayout';
import MainLayout, {
  MainLayoutGridType,
} from '../../components/MainLayout/MainLayout';

const Settings = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const paths = [
    {
      to: PATHS.account,
      title: t('accountTitle', { ns: 'common' }),
      subTitle: t('accountSubTitle', { ns: 'common' }),
      icon: 'ChevronForward',
    },
    {
      to: PATHS.paymentMethods,
      title: t('paymentTitle', { ns: 'common' }),
      subTitle: t('paymentSubTitle', { ns: 'common' }),
      icon: 'ChevronForward',
    },
    {
      to: PATHS.receivingAccounts,
      title: t('receivingAccountTitle', { ns: 'common' }),
      subTitle: t('receivingAccountSubTitle', { ns: 'common' }),
      icon: 'ChevronForward',
    },
    {
      to: PATHS.users,
      title: t('usersTitle', { ns: 'common' }),
      subTitle: t('usersSubTitle', { ns: 'common' }),
      icon: 'ChevronForward',
    },
    {
      to: PATHS.support,
      title: t('supportTitle', { ns: 'common' }),
      subTitle: t('supportSubTitle', { ns: 'common' }),
      icon: 'Open',
    },
  ];

  const isSettings = pathname === PATHS.settings;
  const theme = useTheme();

  const navigate = useNavigate();

  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  let gridType: MainLayoutGridType = 'All';
  if (downLg) {
    if (isSettings) gridType = 'Left';
    else gridType = 'Right';
  }

  return (
    <MainLayout
      fullWidth
      gridType={gridType}
      toolbarComponent={
        <WBFlex
          sx={{
            flexDirection: 'column',
            bgcolor: isSettings ? 'background.paper' : 'background.default',
            justifyContent: 'space-between',
            padding: [6, 8],
            paddingTop: [6, 5],
            height: '100%',
          }}
        >
          <WBFlex
            sx={{ flex: 1 }}
            alignItems={'center'}
            width={'100%'}
            flexDirection={'row'}
            display={{ xs: 'flex', sm: 'none' }}
            mb={2}
            justifyContent="space-between"
          >
            <WBFlex
              sx={{ flex: 1 }}
              alignItems={'center'}
              width={'100%'}
              justifyContent="space-between"
            >
              <SidebarLayout.MenuButton />
            </WBFlex>

            <WBTypography
              variant="h2"
              noWrap
              component="div"
              textAlign={'center'}
              sx={{
                flexGrow: 1,
                flex: 2,
                textAlign: 'left',
              }}
            >
              {t('settingsTitle', { ns: 'common' })}
            </WBTypography>
          </WBFlex>
          <WBFlex flexDirection={'column'} height={'100%'}>
            <WBBox>
              <WBSideNav paths={paths} />
            </WBBox>
            <WBBox flexGrow={1} />
            <TermsConditionsLink />
          </WBFlex>
        </WBFlex>
      }
    >
      <WBBox position={'relative'} width={'100%'} height={'100%'}>
        {downLg ? (
          <WBFlex
            justifyContent="space-between"
            mt={4}
            ml={7}
            sx={{ position: 'absolute', zIndex: 100 }}
          >
            <WBIconButton
              name="ArrowBack"
              onClick={() => {
                navigate(PATHS.settings);
              }}
            >
              <WBIcon
                name="ArrowBack"
                color={
                  pathname === PATHS.paymentMethods
                    ? 'white'
                    : theme.palette.text.primary
                }
                size={'small'}
              />
            </WBIconButton>
          </WBFlex>
        ) : null}
        <Outlet />
      </WBBox>
    </MainLayout>
  );
};

export default Settings;
