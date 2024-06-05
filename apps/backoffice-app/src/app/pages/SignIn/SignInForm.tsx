import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  WBAlert,
  WBButton,
  WBFlex,
  WBForm,
  WBIconButton,
  WBTextField,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  AuthError,
  REGEX,
  RequestStatus,
  SIGNUP_CODE_CHARS,
} from '@admiin-com/ds-common';

export interface ConfirmSignUpFormData {
  email: string;
  code: string;
  password: string;
}

export interface SignInFormData {
  email?: string;
  code?: string;
  password?: string;
}
interface SignInFormProps {
  authStatus: RequestStatus;
  authError: AuthError;
  codeDelivery: string;
  onSignIn: (data: SignInFormData) => void;
  onConfirmSignUp: (data: ConfirmSignUpFormData) => void;
}
export interface ConfirmSignUpFormData {
  email: string;
  code: string;
  password: string;
}

const SignInForm = ({
  authStatus,
  authError,
  codeDelivery,
  onSignIn,
  onConfirmSignUp,
}: SignInFormProps) => {
  const { t } = useTranslation();

  const inputs = useMemo(
    () => ({
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        type: 'email',
        placeholder: null,
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
        placeholder: null,
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: null,
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInput = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  ///**
  // * Set backend error to input
  // */
  //useEffect(() => {
  //  if (authError && authError.code === "UserNotConfirmedException") {
  //    const params = {
  //      email: getValues("email"),
  //      password: getValues("password"),
  //    };
  //
  //    onResendCode(params);
  //  }
  //}, [getValues, setError, authError]);

  ///**
  // * Confirm OTP submit
  // *
  // * @param email
  // * @param password
  // * @param code
  // */
  //const onConfirmOTP = ({ email, password, code }: ConfirmSignUpFormData) => {
  //  const params = {
  //    username: email,
  //    code,
  //    password,
  //  };
  //
  //  onConfirmSignUp(params)
  //};

  /**
   * Handle form submit
   */
  const onSubmit = (data: any) => {
    !codeDelivery ? onSignIn(data) : onConfirmSignUp(data);
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
      onClick={() => onClick(!isPasswordVisible)}
    />
  );

  return (
    <WBForm onSubmit={handleSubmit(onSubmit)}>
      {codeDelivery ? (
        <Controller
          control={control}
          name={inputs.code.name}
          rules={inputs.code.rules}
          defaultValue={inputs.code.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type={inputs.code.type}
              label={inputs.code.label}
              //placeholder={inputs.email.placeholder}
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
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.email.type}
                label={inputs.email.label}
                //placeholder={inputs.email.placeholder}
                error={!!(errors.email && errors.email.message)}
                helperText={
                  ((errors.email && errors.email.message) as string) || ''
                }
                margin="dense"
              />
            )}
          />
          <Controller
            control={control}
            name={inputs.password.name}
            rules={inputs.password.rules}
            defaultValue={inputs.password.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={isPasswordVisible ? 'text' : 'password'}
                inputRef={passwordInput}
                label={inputs.password.label}
                rightIcon={showHidePassword(
                  isPasswordVisible,
                  setIsPasswordVisible
                )}
                error={!!(errors.password && errors.password.message)}
                helperText={
                  ((errors.password && errors.password.message) as string) || ''
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

      <WBFlex mt={2} mb={1}>
        <WBButton loading={authStatus === 'submitting'}>
          {!codeDelivery
            ? t('signInTitle', { ns: 'common' })
            : t('proceedTitle', { ns: 'common' })}
        </WBButton>
      </WBFlex>
    </WBForm>
  );
};

export default SignInForm;
