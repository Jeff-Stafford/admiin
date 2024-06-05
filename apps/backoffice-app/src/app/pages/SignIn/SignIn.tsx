import { Auth } from 'aws-amplify';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WBBox, WBCard, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../../components';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { ADMIN_GROUPS, AuthError, RequestStatus } from '@admiin-com/ds-common';
import ChangePasswordForm, {
  ChangePasswordFormData,
} from '../ChangePassword/ChangePasswordForm';
import SignInForm, {
  ConfirmSignUpFormData,
  SignInFormData,
} from './SignInForm';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location: any = useLocation();
  const [isNewPasswordRequired, setIsNewPasswordRequired] =
    useState<boolean>(false);
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [authUser, setAuthUser] = useState<any>({});
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState<string>('');

  const from: string = useMemo(
    () => location.state?.from?.pathname || null, //TODO check if works
    [location]
  );

  useEffect(() => {
    isLoggedInVar(false);
    localStorage.removeItem('sub');
  }, []);

  /**
   * Sign in a user
   *
   * @param data
   */
  const onSignIn = async (data: SignInFormData) => {
    setAuthStatus('submitting');
    const { email, password } = data;

    if (email && password) {
      const params = {
        username: email?.toLowerCase()?.trim(),
        password,
      };

      let cognitoUser;
      try {
        cognitoUser = await Auth.signIn(params);
      } catch (err: any) {
        console.log('ERROR sign in: ', err.code);
        setAuthError(err);
        setAuthStatus('error');

        if (err.code === 'UserNotConfirmedException') {
          await resendCode({ email });
        }
      }

      console.log('cognitoUser: ', cognitoUser);

      if (cognitoUser) {
        const userGroups: [string] =
          cognitoUser?.signInUserSession?.idToken.payload['cognito:groups'] ||
          [];
        const isAdmin = userGroups.some((admin) =>
          ADMIN_GROUPS.includes(admin)
        );

        setAuthStatus('success');
        if (cognitoUser?.challengeName === 'NEW_PASSWORD_REQUIRED') {
          localStorage.setItem('sub', cognitoUser.username as string);
          //TODO: check isAdmin doesn't break for newly created admin
          setAuthUser(cognitoUser);
          setSubmittedPassword(password);
          setIsNewPasswordRequired(true);
        } else if (isAdmin && from) {
          localStorage.setItem('sub', cognitoUser.username as string);
          isLoggedInVar(true);
          subInVar(cognitoUser.username);
          navigate(from, { replace: true });
        } else if (isAdmin) {
          localStorage.setItem('sub', cognitoUser.username as string);
          isLoggedInVar(true);
          subInVar(cognitoUser.username);
          // redirect to intended page if set and is logged in
          navigate(PATHS.dashboard, { replace: true });
        } else {
          setAuthError({
            code: t('userNotAuthorized', { ns: 'common' }),
          });

          setAuthStatus('error');
        }
      }
    }
  };

  const onSubmitNewPassword = async ({
    newPassword,
  }: ChangePasswordFormData) => {
    setAuthStatus('submitting');
    try {
      await Auth.completeNewPassword(authUser, newPassword);

      // at this time the user is logged in if no MFA required
      localStorage.setItem('sub', authUser.username as string);

      isLoggedInVar(true);
      subInVar(authUser.username);
      navigate(PATHS.dashboard, { replace: true });
    } catch (err: any) {
      console.log('ERROR set new password: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  /**
   * Resend verification code for sign in
   */
  const resendCode = async ({ email }: { email: string }) => {
    setSubmittedEmail(email.toLowerCase().trim());

    try {
      const {
        CodeDeliveryDetails: { DeliveryMedium },
      } = await Auth.resendSignUp(email.toLowerCase().trim());
      setCodeDelivery(DeliveryMedium);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    alert(t('unverifiedEmailSendCode', { ns: 'common' }));
  };

  const onConfirmSignUp = async ({
    email,
    password,
    code,
  }: ConfirmSignUpFormData) => {
    setAuthStatus('submitting');

    try {
      await Auth.confirmSignUp(email, code);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    try {
      const params = {
        username: email.toLowerCase().trim(),
        password,
      };

      const user = await Auth.signIn(params);

      localStorage.setItem('sub', user.username as string);
      isLoggedInVar(true);
      subInVar(user.username);
      // redirect to dashboard if logged in
      navigate(PATHS.dashboard, { replace: true });
    } catch (err: any) {
      console.log('ERROR sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
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
          {codeDelivery
            ? t('verificationSent', { ns: 'common' })
            : t('adminSignIn', { ns: 'backoffice' })}
        </WBTypography>

        <WBFlex flexDirection="row" flexWrap="wrap">
          {codeDelivery && !isNewPasswordRequired && (
            <WBTypography>
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              {submittedEmail}
            </WBTypography>
          )}

          {!codeDelivery && isNewPasswordRequired && (
            <WBTypography>
              {t('newPasswordContinue', { ns: 'common' })}
            </WBTypography>
          )}
        </WBFlex>

        {!isNewPasswordRequired && (
          <SignInForm
            authError={authError}
            authStatus={authStatus}
            codeDelivery={codeDelivery}
            onSignIn={onSignIn}
            onConfirmSignUp={onConfirmSignUp}
          />
        )}

        {isNewPasswordRequired && (
          <ChangePasswordForm
            authError={authError}
            authStatus={authStatus}
            oldPassword={submittedPassword}
            onSubmit={onSubmitNewPassword}
          />
        )}

        <WBFlex
          flexDirection="row"
          flexWrap="wrap"
          flex={1}
          justifyContent="center"
        >
          <WBBox mt={3}>
            <Link to={PATHS.resetPassword}>
              {t('forgotPasswordTitle', { ns: 'common' })}
            </Link>
          </WBBox>
        </WBFlex>
      </WBCard>
    </WBFlex>
  );
};

export default SignIn;
