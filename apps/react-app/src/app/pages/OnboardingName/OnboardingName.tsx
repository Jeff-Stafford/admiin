import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import OnboardingNameForm from './OnboardingNameForm';
const OnboardingName = () => {
  const { t } = useTranslation();
  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 6,
      }}
    >
      <WBTypography variant="h3">
        {t('onboardingNametitle', { ns: 'onboarding' })}
      </WBTypography>

      <WBTypography variant="body1" mb={[3, 15]} textAlign="center">
        {t('onboardingNamebody', { ns: 'onboarding' })}
      </WBTypography>
      <OnboardingNameForm />
    </PageContainer>
  );
};

export default OnboardingName;
