import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <WBFlex>
      <WBTypography>{t('404NotFound', { ns: 'common' })}</WBTypography>
    </WBFlex>
  );
};

export default NotFound;
