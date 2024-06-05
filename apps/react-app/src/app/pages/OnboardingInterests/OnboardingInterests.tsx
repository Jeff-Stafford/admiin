import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import OnboardingInterestsForm from './OnboardingInterestsForm';

const OnboardingInterests = () => {
  const { t } = useTranslation();
  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <WBTypography variant="h1">
        {t('selectInterestsTitle', { ns: 'common' })}
      </WBTypography>
      <OnboardingInterestsForm />
    </PageContainer>
  );
};

export default OnboardingInterests;
