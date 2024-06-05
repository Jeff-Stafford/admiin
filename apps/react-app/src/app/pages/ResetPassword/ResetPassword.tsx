import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components';
import { WBBox, WBFlex, WBLink, WBTypography } from '@admiin-com/ds-web';
import ResetPwdForm from './ResetPasswordForm';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [codeDelivery, setCodeDelivery] = useState<{
    deliveryMedium: string;
    destination: string;
  } | null>(null);
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});

  const [, setSubmittedEmail] = useState('');

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
      const { CodeDeliveryDetails } = await Auth.forgotPassword(
        email.toLowerCase().trim()
      );
      console.log('CodeDeliveryDetails:', CodeDeliveryDetails);
      const { Destination, DeliveryMedium } = CodeDeliveryDetails;
      setCodeDelivery({
        destination: Destination,
        deliveryMedium: DeliveryMedium,
      });
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
    <PageContainer
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: 'background.default',
        height: '100vh',
      }}
    >
      <WBFlex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          width: ['100%', '100%', '50%'],
          paddingTop: 6,
          paddingBottom: 3,
        }}
      >
        <WBTypography variant="h2" sx={{ mt: { xs: 5, sm: 2 } }}>
          {t('resetPasswordTitle', { ns: 'common' })}
        </WBTypography>

        <WBBox mb={7}>
          {codeDelivery ? (
            <WBTypography
              variant="body2"
              fontWeight="regular"
              textAlign="center"
            >
              {t(
                codeDelivery?.deliveryMedium === 'SMS'
                  ? 'enterVerificationCodeSentSMS'
                  : 'enterVerificationCodeSentEmail',
                { ns: 'common' }
              )}{' '}
              <WBBox as="span" fontWeight="medium">
                {codeDelivery?.destination?.replace('+', '')}
              </WBBox>
            </WBTypography>
          ) : (
            <WBTypography
              variant="body2"
              fontWeight="regular"
              textAlign="center"
            >
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
        <WBFlex sx={{ flexGrow: 1 }}></WBFlex>
        <WBTypography textAlign="center">
          {`${t('rememberPassword', { ns: 'common' })} `}
          <WBLink to={PATHS.signIn} underline="always">
            {t('signInTitle', { ns: 'common' })}
          </WBLink>
        </WBTypography>
      </WBFlex>
    </PageContainer>
  );
};

export default ResetPassword;
