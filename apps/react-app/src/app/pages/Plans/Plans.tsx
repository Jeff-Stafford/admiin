import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

const Plans = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('plansTitle', { ns: 'common' })}
      </WBTypography>
    </PageContainer>
  );
};

export default Plans;
