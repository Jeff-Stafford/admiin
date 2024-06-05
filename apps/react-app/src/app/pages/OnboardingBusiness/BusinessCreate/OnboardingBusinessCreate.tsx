import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../../components';
import OnboardingBusinessCreateForm from './OnboardingBusinessCreateForm';

const OnboardingBusinessCreate = () => {
  const { t } = useTranslation();
  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingY: 6,
      }}
    >
      <WBTypography variant="h3">
        {t('onboardingBusinessCreateTitle', { ns: 'onboarding' })}
      </WBTypography>

      <WBTypography variant="body1" mb={[3, 15]} textAlign="center">
        {t('onboardingBusinessCreateBody', { ns: 'onboarding' })}
      </WBTypography>
      <OnboardingBusinessCreateForm />
    </PageContainer>
  );
};
export default OnboardingBusinessCreate;
