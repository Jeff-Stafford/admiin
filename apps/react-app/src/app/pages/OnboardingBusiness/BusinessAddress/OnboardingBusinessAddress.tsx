import { WBTypography } from '@admiin-com/ds-web';

import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../../components';
import OnboardingBusinessAddressForm from './OnboardingBusinessAddressForm';

const OnboardingBusinessAddressLookup = () => {
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
        {t('onboardingBusinessAddressTitle', { ns: 'onboarding' })}
      </WBTypography>

      <WBTypography variant="body1" mb={[3, 15]}>
        {t('onboardingBusinessAddressBody', { ns: 'onboarding' })}
      </WBTypography>
      <OnboardingBusinessAddressForm />
    </PageContainer>
  );
};
export default OnboardingBusinessAddressLookup;
