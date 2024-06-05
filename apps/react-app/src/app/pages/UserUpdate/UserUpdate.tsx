import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
// import UserForm from './UserForm';

const UserUpdate = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <WBTypography variant="h1">Edit profile</WBTypography>
      <WBTypography variant="h4" mt={4}>
        {t('profileTitle', { ns: 'common' })}
      </WBTypography>
      {/*<UserForm />*/}
    </PageContainer>
  );
};

export default UserUpdate;
