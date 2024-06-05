import React from 'react';
import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { OptionForm, PageContainer } from '../../components';

const OptionCreateUpdate = () => {
  const { t } = useTranslation();
  const { group } = useParams();
  return (
    <PageContainer>
      <WBTypography variant="h1">{group}</WBTypography>
      <WBTypography>
        {t('addOptionForTitle', { ns: 'backoffice' })} {group}
      </WBTypography>
      {group && <OptionForm name={group} />}
    </PageContainer>
  );
};

export default OptionCreateUpdate;
