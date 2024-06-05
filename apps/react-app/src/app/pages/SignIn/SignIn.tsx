import { gql, useLazyQuery } from '@apollo/client';
import { Analytics, Auth } from 'aws-amplify';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WBAlert,
  WBBox,
  WBFlex,
  WBLink,
  WBTypography,
} from '@admiin-com/ds-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import { PageContainer } from '../../components';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { getOnboardingPath } from '../../helpers/onboarding';
import { PATHS } from '../../navigation/paths';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import NewPasswordForm, { NewPasswordFormData } from './NewPasswordForm';
import SignInForm, {
  ConfirmMfaFormData,
  ConfirmSignUpFormData,
  SignInFormData,
} from './SignInForm';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import mixpanel from 'mixpanel-browser';
//import LOGO from '../../../assets/logo-full.svg';
import { SignInLogo } from '../../components/SignInLogo/SignInLogo';
import AdmiinLogo from '../../components/AdmiinLogo/AdmiinLogo';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewPasswordRequired, setIsNewPasswordRequired] =
    useState<boolean>(false);
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [mfaCodeRequired, setMfaCodeRequired] = useState(false);
  const [authUser, setAuthUser] = useState<any>({});
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');

  const [getUser, { error: userError }] = useLazyQuery(gql(GET_USER));

  const from: string = useMemo(
    () => location.state?.from?.pathname || null,
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
    setAuthError({});
    const { email, password } = data;

    if (email && password) {
      const params = {
        username: email?.toLowerCase()?.trim(),
        password,
      };

      let signInResponse;
      try {
        signInResponse = await Auth.signIn(params);
      } catch (err: any) {
        console.log('ERROR sign in: ', err.code);
        setAuthStatus('error');

        if (err.code === 'UserNotConfirmedException') {
          await resendCode({ email });
        } else {
          setAuthError(err);
        }
      }

      if (signInResponse) {
        localStorage.setItem('sub', signInResponse.username as string);

        // update analytics userId
        const options = {
          userId: signInResponse.username,
        };
        try {
          await Analytics.updateEndpoint(options);
        } catch (err) {
          console.log('ERROR update endpoint: ', err);
        }

        try {
          mixpanel.identify(signInResponse.username);
        } catch (err) {
          console.log('ERROR mixpanel identify');
        }

        //mfa sign in
        // signInResponse.challengeName === 'SMS_MFA' ||
        if (signInResponse.challengeName === 'SOFTWARE_TOKEN_MFA') {
          setAuthUser(signInResponse);
          setMfaCodeRequired(true);
          setAuthStatus('success');
        }

        // sign in success
        else {
          await onSignInSuccess(signInResponse, password);
        }
      }
    }
  };

  const onSignInSuccess = async (signInResponse: any, password = '') => {
    let loggedInUserData;
    if (signInResponse?.challengeName !== 'NEW_PASSWORD_REQUIRED') {
      try {
        loggedInUserData = await getUser({
          variables: {
            id: signInResponse.username,
            skip: signInResponse?.challengeName === 'NEW_PASSWORD_REQUIRED',
          },
        });
      } catch (err) {
        console.log('ERROR getUser', err);
      }
    }

    const loggedInUser = loggedInUserData?.data?.getUser;
    console.log('loggedInUser: ', loggedInUser);

    setAuthStatus('success');
    if (signInResponse?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      setAuthUser(signInResponse);
      setSubmittedPassword(password);
      setIsNewPasswordRequired(true);
    } else if (loggedInUser?.onboardingStatus !== OnboardingStatus.COMPLETED) {
      isLoggedInVar(true);
      subInVar(signInResponse.username);
      navigate(getOnboardingPath(loggedInUser), { replace: true });
    } else if (from) {
      isLoggedInVar(true);
      subInVar(signInResponse.username);
      // redirect to intended page if set and is logged in
      navigate(from, { replace: true });
    } else {
      isLoggedInVar(true);
      subInVar(signInResponse.username);
      // redirect to dashboard if logged in
      navigate(getOnboardingPath(loggedInUser), { replace: true });
    }
  };

  const onSubmitNewPassword = async ({ newPassword }: NewPasswordFormData) => {
    setAuthStatus('submitting');
    let cognitoUser;
    try {
      cognitoUser = await Auth.completeNewPassword(authUser, newPassword);

      // at this time the user is logged in if no MFA required
      localStorage.setItem('sub', authUser.username as string);

      let loggedInUserData;
      let loggedInUser;
      try {
        loggedInUserData = await getUser({
          variables: {
            id: cognitoUser.username,
          },
        });

        loggedInUser = loggedInUserData?.data?.getUser;
      } catch (err) {
        console.log('ERROR getUser', err);
      }
      isLoggedInVar(true);
      subInVar(authUser.username);
      navigate(getOnboardingPath(loggedInUser), { replace: true });
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
    setAuthError({});

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
      setAuthStatus('success');
      navigate(PATHS.onboardingName, { replace: true });
    } catch (err: any) {
      console.log('ERROR sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onConfirmMfa = async ({ code }: ConfirmMfaFormData) => {
    setAuthStatus('submitting');
    try {
      const confirmSignInResponse = await Auth.confirmSignIn(
        authUser,
        code,
        'SOFTWARE_TOKEN_MFA'
      ); // SMS_MFA, SOFTWARE_TOKEN_MFA
      console.log('confirmSignInResponse: ', confirmSignInResponse);

      await onSignInSuccess(confirmSignInResponse);
    } catch (err: any) {
      console.log('ERROR mfa sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onResendCode = async () => {
    setAuthError({});
    setAuthStatus('idle');
    try {
      await Auth.resendSignUp(submittedEmail);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }
  };
  return (
    <PageContainer
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0,
        height: '100vh',
      }}
    >
      <WBFlex
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={15}
        paddingBottom={3}
        mx={2}
        position="relative"
      >
        {codeDelivery && (
          <WBTypography variant="h2">
            {t('verificationSent', { ns: 'common' })}
          </WBTypography>
        )}
        {mfaCodeRequired && (
          <WBTypography variant="h2">
            {t('mfaCodeRequired', { ns: 'authentication' })}
          </WBTypography>
        )}

        <WBFlex flexDirection="row" flexWrap="wrap">
          {mfaCodeRequired && (
            <WBTypography>
              {t('enterMfaCode', { ns: 'authentication' })}
            </WBTypography>
          )}
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
            mfaCodeRequired={mfaCodeRequired}
            authError={authError}
            authStatus={authStatus}
            codeDelivery={codeDelivery}
            onSignIn={onSignIn}
            onConfirmSignUp={onConfirmSignUp}
            onConfirmMfa={onConfirmMfa}
            onResendCode={onResendCode}
          />
        )}

        {isNewPasswordRequired && (
          <NewPasswordForm
            submittedEmail={submittedEmail}
            authError={authError}
            authStatus={authStatus}
            oldPassword={submittedPassword}
            onSubmit={onSubmitNewPassword}
          />
        )}

        {userError?.message && (
          <WBAlert title={userError.message} severity="error" />
        )}
        <WBFlex sx={{ flexGrow: 1 }}></WBFlex>
        {!codeDelivery && !isNewPasswordRequired && !mfaCodeRequired && (
          <WBTypography>
            {`${t('noAccount', { ns: 'signIn' })} `}
            <WBLink to={PATHS.signUp} underline="always">
              {t('signUpTitle', { ns: 'common' })}
            </WBLink>
          </WBTypography>
        )}
      </WBFlex>
      <WBFlex flex={1} display={['none', 'none', 'flex']}>
        <SignInLogo />
      </WBFlex>
    </PageContainer>
  );
};

export default SignIn;
