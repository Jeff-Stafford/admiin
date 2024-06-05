import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import React from 'react';
import { ChangeLanguage, Link, PageContainer } from '../../components';
import { PATHS } from '../../navigation/paths';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <PageContainer sx={{ alignItems: 'flex-start' }}>
      <WBFlex flexDirection="column">
        <WBTypography variant="h1">
          {t('settingsTitle', { ns: 'common' })}
        </WBTypography>
        <Link to={PATHS.changePassword}>
          {t('changePasswordTitle', { ns: 'common' })}
        </Link>
        <WBFlex flexDirection="row" alignItems="center">
          <WBTypography>{t('languageTitle', { ns: 'common' })}</WBTypography>
          <ChangeLanguage />
        </WBFlex>
      </WBFlex>
    </PageContainer>
  );
};

export default Settings;
