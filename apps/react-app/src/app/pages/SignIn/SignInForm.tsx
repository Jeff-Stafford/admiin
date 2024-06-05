import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBIconButton,
  WBLink,
  WBTextField,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  AuthError,
  REGEX,
  RequestStatus,
  SIGNUP_CODE_CHARS,
} from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';
import { OAuthButton } from '../../components/OAuthButton/OAuthButton';
import AdmiinLogo from '../../components/AdmiinLogo/AdmiinLogo';

export interface SignInFormData {
  email?: string;
  code?: string;
  password?: string;
}

export interface ConfirmSignUpFormData {
  email: string;
  code: string;
  password: string;
}

export interface ConfirmMfaFormData {
  code: string;
}

interface SignInFormProps {
  mfaCodeRequired: boolean;
  authStatus: RequestStatus;
  authError: AuthError;
  codeDelivery: string;
  onSignIn: (data: SignInFormData) => void;
  onConfirmMfa: (data: ConfirmMfaFormData) => void;
  onConfirmSignUp: (data: ConfirmSignUpFormData) => void;
  onResendCode: () => void;
}

const SignInForm = ({
  mfaCodeRequired,
  authStatus,
  authError,
  codeDelivery,
  onSignIn,
  onConfirmMfa,
  onConfirmSignUp,
  onResendCode,
}: SignInFormProps) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInput = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = useMemo(
    () => ({
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        type: 'email',
        placeholder: t('emailPlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      password: {
        label: t('passwordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: t('passwordPlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: '',
        type: 'number',
        defaultValue: '',
        rules: {
          required: t('codeRequired', { ns: 'common' }),
          minLength: {
            value: SIGNUP_CODE_CHARS,
            message: `${t('codeMustBe', {
              ns: 'common',
            })} ${SIGNUP_CODE_CHARS} ${t('characters', { ns: 'common' })}`,
          },
        },
      },
    }),
    [t]
  );

  /**
   * Handle form submit
   */
  const onSubmit = (data: any) => {
    // 2fa sign in
    if (mfaCodeRequired) {
      onConfirmMfa(data);
    }
    // complete sign up
    else if (codeDelivery) {
      onConfirmSignUp(data);
    }
    // sign in
    else {
      onSignIn(data);
    }
    //!codeDelivery ? onSignIn(data) : onConfirmSignUp(data);
  };

  /**
   * Renders the show / hide password for input
   *
   * @returns {*}
   */
  const showHidePassword = (
    isPasswordVisible: boolean,
    onClick: (isPasswordVisible: boolean) => void
  ) => (
    <WBIconButton
      size="small"
      icon={isPasswordVisible ? 'EyeOff' : 'Eye'}
      sx={{ opacity: isPasswordVisible ? 1 : 0.1 }}
      onClick={() => onClick(!isPasswordVisible)}
    />
  );

  /**
   * Reset code field and trigger resend new code
   */
  const onResendCodePress = async () => {
    setValue('code', '');

    onResendCode();
  };

  return (
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '80%',
        sm: '80%',
        md: '60%',
        lg: '60%',
      }}
    >
      {!codeDelivery && !mfaCodeRequired && (
        <WBFlex width={'100%'} justifyContent={'start'}>
          {/* <WBTypography variant="h2" sx={{ mt: { xs: 5, sm: 2 } }}>
          {t('loginTo', { ns: 'signIn' })}
        </WBTypography> */}

          <AdmiinLogo />
        </WBFlex>
      )}
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        {codeDelivery || mfaCodeRequired ? (
          <Controller
            control={control}
            name={inputs.code.name}
            rules={inputs.code.rules}
            defaultValue={inputs.code.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <WBTextField
                {...field}
                type={inputs.code.type}
                label={inputs.code.label}
                placeholder={inputs.code.placeholder}
                error={!!(errors.code && errors.code.message)}
                helperText={
                  ((errors.code && errors.code.message) as string) || ''
                }
                margin="dense"
              />
            )}
          />
        ) : (
          <>
            <Controller
              control={control}
              name={inputs.email.name}
              rules={inputs.email.rules}
              defaultValue={inputs.email.defaultValue}
              render={({ field: { ref, ...field } }) => (
                <WBTextField
                  {...field}
                  type={inputs.email.type}
                  label={inputs.email.label}
                  autoComplete="username"
                  placeholder={inputs.email.placeholder}
                  error={!!(errors.email && errors.email.message)}
                  helperText={
                    ((errors.email && errors.email.message) as string) || ''
                  }
                  autoFocus
                  margin="dense"
                />
              )}
            />
            <Controller
              control={control}
              name={inputs.password.name}
              rules={inputs.password.rules}
              defaultValue={inputs.password.defaultValue}
              render={({ field: { ref, ...field } }) => (
                <WBTextField
                  {...field}
                  type={isPasswordVisible ? 'text' : 'password'}
                  inputRef={passwordInput}
                  autoComplete="current-password"
                  placeholder={inputs.password.placeholder}
                  label={
                    // <WBFlex justifyContent="space-between">
                    <>
                      {inputs.password.label}
                      {!mfaCodeRequired && !codeDelivery && (
                        <WBLink
                          sx={{ float: 'right' }}
                          to={PATHS.resetPassword}
                          variant="body2"
                          color="text.primary"
                          underline="always"
                          borderColor="black"
                          tabIndex={-1}
                          fontWeight="regular"
                        >
                          {t('forgotPasswordTitle', { ns: 'common' })}
                        </WBLink>
                      )}
                    </>
                    // </WBFlex>
                  }
                  rightIcon={showHidePassword(
                    isPasswordVisible,
                    setIsPasswordVisible
                  )}
                  error={!!(errors.password && errors.password.message)}
                  helperText={
                    ((errors.password && errors.password.message) as string) ||
                    ''
                  }
                  margin="dense"
                />
              )}
            />
          </>
        )}

        {authError?.code && (
          <WBAlert
            title={t(authError.code, { ns: 'authentication' })}
            severity="error"
          />
        )}

        <WBFlex mt={6} mb={1}>
          <WBButton loading={authStatus === 'submitting'} fullWidth>
            {!codeDelivery
              ? t('signInTitle', { ns: 'common' })
              : t('proceedTitle', { ns: 'common' })}
          </WBButton>
        </WBFlex>

        <OAuthButton />

        {codeDelivery && (
          <WBFlex justifyContent="center">
            <WBButton variant="text" type="button" onClick={onResendCodePress}>
              {t('resendCodeTitle', { ns: 'common' })}
            </WBButton>
          </WBFlex>
        )}
      </WBForm>
    </WBFlex>
  );
};

export default SignInForm;
