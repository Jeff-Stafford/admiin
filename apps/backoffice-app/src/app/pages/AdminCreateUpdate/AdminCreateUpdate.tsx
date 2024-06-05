import { WBTypography } from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../../components';
import AdminForm from './AdminForm';

const AdminCreateUpdate = () => {
  const { t } = useTranslation();
  const { adminId } = useParams();
  return (
    <PageContainer>
      <WBTypography variant="h1">
        {adminId
          ? t('updateAdminTitle', { ns: 'backoffice' })
          : t('createAdminTitle', { ns: 'backoffice' })}
      </WBTypography>
      <AdminForm />
    </PageContainer>
  );
};

export default AdminCreateUpdate;
