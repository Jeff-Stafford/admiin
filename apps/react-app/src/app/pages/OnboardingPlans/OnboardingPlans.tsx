import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

const OnboardingPlans = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <WBTypography variant="h1" textAlign="center">
        {t('choosePlan', { ns: 'purchase' })}
      </WBTypography>
    </PageContainer>
  );
};

export default OnboardingPlans;
