import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { InterestsForm, PageContainer } from '../../components';

const Interests = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <WBTypography variant="h1" textAlign="center">
        {t('selectYourInterests', { ns: 'interests' })}
      </WBTypography>
      <InterestsForm />
    </PageContainer>
  );
};

export default Interests;
