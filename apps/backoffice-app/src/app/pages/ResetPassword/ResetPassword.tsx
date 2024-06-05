import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from '../../components';
import { WBBox, WBCard, WBFlex, WBTypography } from '@admiin-com/ds-web';
import ResetPwdForm from './ResetPasswordForm';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});

  const [submittedEmail, setSubmittedEmail] = useState('');

  /**
   * Gets code to reset password
   *
   * @param email
   */
  const getResetCode = async ({ email }: { email: string }) => {
    setAuthStatus('submitting');
    setAuthError({});
    setSubmittedEmail(email.toLowerCase().trim());

    try {
      const {
        CodeDeliveryDetails: { DeliveryMedium },
      } = await Auth.forgotPassword(email.toLowerCase().trim());
      setCodeDelivery(DeliveryMedium);
    } catch (err: any) {
      console.log('ERROR forgot password get code: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
    setAuthStatus('success');
  };

  /**
   * Reset password with code
   * @param email
   * @param code
   * @param password
   */
  const resetPassword = async ({
    email,
    code,
    password,
  }: {
    email: string;
    code: string;
    password: string;
  }) => {
    setAuthError({});
    setAuthStatus('submitting');
    try {
      await Auth.forgotPasswordSubmit(
        email.toLowerCase().trim(),
        code,
        password
      );
      window.alert(t('passwordHasBeenReset', { ns: 'common' }));
      navigate(PATHS.signIn, { replace: true });
    } catch (err: any) {
      console.log('ERROR forgot password submit: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
    setAuthStatus('success');
  };

  return (
    <WBFlex justifyContent="center" alignItems="center" flex={1}>
      <WBCard
        sx={{
          width: ['100%', '100%', '50%'],
          backgroundColor: 'background.paper',
          boxShadow: 5,
          borderRadius: 1,
          padding: 5,
        }}
      >
        <WBTypography variant="h2" color="textSecondary">
          {t('resetPasswordTitle', { ns: 'common' })}
        </WBTypography>

        <WBBox>
          {codeDelivery ? (
            <WBTypography>
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              {submittedEmail}
            </WBTypography>
          ) : (
            <WBTypography>
              {t('sendVerificationCodeResetPassword', { ns: 'common' })}
            </WBTypography>
          )}
        </WBBox>

        <ResetPwdForm
          authStatus={authStatus}
          authError={authError}
          codeDelivery={codeDelivery}
          getResetCode={getResetCode}
          resetPassword={resetPassword}
        />

        <WBFlex
          my={3}
          flexDirection="row"
          flexWrap="wrap"
          flex={1}
          justifyContent="center"
        >
          <WBBox mt={3}>
            {!codeDelivery && (
              <Link to={PATHS.signIn}>
                {t('backToLogin', { ns: 'common' })}
              </Link>
            )}
          </WBBox>
        </WBFlex>
      </WBCard>
    </WBFlex>
  );
};

export default ResetPassword;
