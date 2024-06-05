import { WBTypography } from '@admiin-com/ds-web';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import ChangePasswordForm, {
  ChangePasswordFormData,
} from './ChangePasswordForm';

const ChangePassword = () => {
  const { t } = useTranslation();
  const [authError, setAuthError] = useState<AuthError>({});
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');

  const onChangePassword = async ({
    oldPassword,
    newPassword,
  }: ChangePasswordFormData) => {
    setAuthStatus('submitting');
    try {
      const user = await Auth.currentAuthenticatedUser();

      await Auth.changePassword(user, oldPassword, newPassword);
      setAuthStatus('success');
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('changePasswordTitle', { ns: 'common' })}
      </WBTypography>
      <ChangePasswordForm
        authError={authError}
        authStatus={authStatus}
        onSubmit={onChangePassword}
      />
    </PageContainer>
  );
};

export default ChangePassword;
