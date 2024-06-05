import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBIconButton,
  WBTextField,
} from '@admiin-com/ds-web';
import {
  REGEX,
  PASSWORD_POLICY,
  SIGNUP_CODE_CHARS,
  RequestStatus,
  AuthError,
} from '@admiin-com/ds-common';
import { useTranslation } from 'react-i18next';

interface ResetPasswordFormProps {
  authStatus: RequestStatus;
  authError: AuthError;
  codeDelivery: {
    deliveryMedium: string;
    destination: string;
  } | null;
  getResetCode: ({ email }: { email: string }) => void;
  resetPassword: ({
    email,
    code,
    password,
  }: {
    email: string;
    code: string;
    password: string;
  }) => void;
}

const ResetPasswordForm = ({
  authStatus,
  authError,
  codeDelivery,
  getResetCode,
  resetPassword,
}: ResetPasswordFormProps) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const passwordInput = useRef(null);
  const confirmInput = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { password } = watch();

  const inputs = useMemo(
    () => ({
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        type: 'email',
        placeholder: '',
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
        label: t('newPasswordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('newPasswordRequired', { ns: 'common' }),
          //pattern: {
          //  value: REGEX.PASSWORD,
          //  message: "Password must contain a lowercase, uppercase letter and a number"
          //},
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },
        },
      },
      passwordConfirm: {
        name: 'passwordConfirm',
        label: t('confirmPasswordTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('confirmPasswordRequired', { ns: 'common' }),
          validate: (value: string) =>
            value === password || t('confirmNotMatch', { ns: 'common' }),
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        type: 'text',
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
    [t, password]
  );

  /**
   * Handle form submit
   */
  const onSubmit = (data: any) => {
    !codeDelivery ? getResetCode(data) : resetPassword(data);
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
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '80%',
        sm: '80%',
        md: '80%',
        lg: '40%',
      }}
    >
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        {!codeDelivery ? (
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
                error={!!(errors.email && errors.email.message)}
                helperText={
                  ((errors.email && errors.email.message) as string) || ''
                }
                margin="dense"
              />
            )}
          />
        ) : (
          <WBBox>
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
                    ((errors.password && errors.password.message) as string) ||
                    ''
                  }
                  margin="dense"
                />
              )}
            />
            <Controller
              control={control}
              name={inputs.passwordConfirm.name}
              rules={inputs.passwordConfirm.rules}
              defaultValue={inputs.passwordConfirm.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={isConfirmVisible ? 'text' : 'password'}
                  inputRef={confirmInput}
                  label={inputs.passwordConfirm.label}
                  rightIcon={showHidePassword(
                    isConfirmVisible,
                    setIsConfirmVisible
                  )}
                  error={
                    !!(errors.passwordConfirm && errors.passwordConfirm.message)
                  }
                  helperText={
                    ((errors.passwordConfirm &&
                      errors.passwordConfirm.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
          </WBBox>
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
              ? t('resetPasswordTitle', { ns: 'common' })
              : t('submitTitle', { ns: 'common' })}
          </WBButton>
        </WBFlex>
      </WBForm>
    </WBFlex>
  );
};

export default ResetPasswordForm;
