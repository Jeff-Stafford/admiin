import { Analytics, Auth } from 'aws-amplify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { WBBox, WBFlex, WBLink, WBTypography } from '@admiin-com/ds-web';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import SignUpForm, { SignUpFormData } from './SignUpForm';
import mixpanel from 'mixpanel-browser';
import { SignInLogo } from '../../components/SignInLogo/SignInLogo';
import { BackButton } from '../../components/BackButton/BackButton';

export type VerifyStep = 'EMAIL' | 'PHONE' | 'CODE';

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [verifyStep, setVerifyStep] = useState<VerifyStep>('EMAIL');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');

  // get signup code for phone verification
  const onGetCode = async (phone: string) => {
    setAuthStatus('submitting');
    const params = {
      username: submittedUserName,
      password: submittedPassword,
      attributes: {
        email: submittedEmail.toLowerCase().trim(),
        phone_number: phone.replace(/\s/g, '') || null,
        locale: i18n.resolvedLanguage,
      },
    };

    if (phone) {
      setSubmittedPhone(phone);
    }

    try {
      const { codeDeliveryDetails } = await Auth.signUp(params);
      setCodeDelivery(codeDeliveryDetails.DeliveryMedium);
      setVerifyStep('CODE');
    } catch (err: any) {
      if (err?.code === 'UsernameExistsException') {
        try {
          const user = await Auth.resendSignUp(submittedUserName);
          console.log('Verification code resent successfully', user);
          setVerifyStep('CODE'); // Move to code verification step
        } catch (resendError: any) {
          console.error('Error resending code: ', resendError);
          setAuthError(resendError);
          setAuthStatus('error');
        }
      } else {
        setAuthError(err);
        setAuthStatus('error');
      }
    }

    setAuthStatus('success');
  };

  const onSignUp = async ({ email, password, phone }: SignUpFormData) => {
    setVerifyStep('PHONE');
    setSubmittedEmail(email);

    const username = email.toLowerCase().trim();
    if (username) {
      setSubmittedUserName(username);
    }

    setSubmittedPassword(password);
  };

  const onConfirmSignUp = async ({ phone, password, code }: SignUpFormData) => {
    setAuthStatus('submitting');
    let response;
    try {
      response = await Auth.confirmSignUp(submittedUserName, code);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    if (response) {
      try {
        const params = {
          username: submittedUserName,
          password,
        };

        const user = await Auth.signIn(params);

        localStorage.setItem('sub', user.username as string);

        // update analytics userId
        const options = {
          userId: user.username,
        };

        try {
          await Analytics.updateEndpoint(options);
        } catch (err) {
          console.log('ERROR update endpoint: ', err);
        }

        try {
          mixpanel.identify(user.username);
        } catch (err) {
          console.log('ERROR mixpanel identify');
        }
        isLoggedInVar(true);
        subInVar(user.username);
        // redirect to dashboard if logged in
        navigate(PATHS.onboardingName, { replace: true });
      } catch (err: any) {
        console.log('ERROR sign in: ', err);
        setAuthError(err);
        setAuthStatus('error');
      }
    }
  };

  /**
   * Handle submit sign up form
   */
  const onSubmit = (data: SignUpFormData) => {
    console.log('onsubmit: ', data);

    setAuthError({});

    if (verifyStep === 'EMAIL') {
      onSignUp(data);
    }

    if (verifyStep === 'PHONE') {
      onGetCode(data.phone);
    }

    if (verifyStep === 'CODE') {
      onConfirmSignUp(data);
    }
  };

  /**
   * Reset code field and trigger resend new code
   */
  const onResendCode = async () => {
    setAuthError({});
    setAuthStatus('idle');
    try {
      await Auth.resendSignUp(submittedUserName);
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
        paddingTop={6}
        paddingBottom={3}
        mx={2}
        position="relative"
      >
        {verifyStep !== 'EMAIL' ? (
          <BackButton
            onClick={() => {
              setVerifyStep('EMAIL');
            }}
          />
        ) : null}
        <WBBox sx={{ mb: { md: 5, xs: 1 } }}>
          <WBTypography
            variant="h2"
            sx={{
              mt: {
                xs: verifyStep !== 'EMAIL' ? 9 : 5,
                sm: verifyStep !== 'EMAIL' ? 6 : 2,
              },
              mx: 2,
              textAlign: 'center',
            }}
          >
            {verifyStep !== 'EMAIL'
              ? t('codeSent', { ns: 'common' })
              : t('', { ns: 'common' })}
          </WBTypography>

          {verifyStep === 'PHONE' && (
            <WBTypography textAlign="center">
              {t('sendVerificationCodeVerification', { ns: 'common' })}
            </WBTypography>
          )}
          {verifyStep === 'CODE' && (
            <WBTypography textAlign="center">
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              <WBBox as="span" fontWeight={600}>
                {submittedPhone}
              </WBBox>
            </WBTypography>
          )}
        </WBBox>

        <SignUpForm
          authError={authError}
          authStatus={authStatus}
          codeDelivery={codeDelivery}
          verifyStep={verifyStep}
          onSubmit={onSubmit}
          onGetCodePress={onGetCode}
          onResendCode={onResendCode}
        />

        <WBFlex sx={{ flexGrow: 1 }} />
        {
          <WBTypography variant="body1">
            {t('alreadyHaveAccount', { ns: 'signUp' })}{' '}
            <WBLink to={PATHS.signIn} underline="always">
              {t('signInTitle', { ns: 'common' })}
            </WBLink>
          </WBTypography>
        }

        {/* {codeDelivery && (
         <WBTypography>
         {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
         <WBBox component="span" fontWeight={600}>
         {codeDelivery === 'EMAIL' ? submittedEmail : submittedPhone}
         </WBBox>
         </WBTypography>
         )} */}
        {/* <WBFlex mt={3}>
         <SignUpXero />
         </WBFlex> */}
      </WBFlex>
      <WBFlex flex={1} display={['none', 'none', 'flex']}>
        <SignInLogo />
      </WBFlex>
    </PageContainer>
  );
};

export default SignUp;
