import { WBTypography } from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('dashboardTitle', { ns: 'backoffice' })}
      </WBTypography>
    </PageContainer>
  );
};

export default Dashboard;
