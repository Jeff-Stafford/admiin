import {
  WBAlert,
  WBButton,
  WBForm,
  WBIconButton,
  WBTextField,
} from '@admiin-com/ds-web';
import { useMemo, useRef, useState } from 'react';
import {
  AuthError,
  PASSWORD_POLICY,
  RequestStatus,
} from '@admiin-com/ds-common';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

interface ChangePasswordFormProps {
  authStatus: RequestStatus;
  authError: AuthError;
  oldPassword?: string;
  onSubmit: SubmitHandler<ChangePasswordFormData>;
}

const ChangePasswordForm = ({
  authStatus,
  authError,
  oldPassword,
  onSubmit,
}: ChangePasswordFormProps) => {
  const { t } = useTranslation();
  const [isOldVisible, setIsOldVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const oldPasswordInput = useRef(null);
  const newPasswordInput = useRef(null);
  const passwordConfirmInput = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ChangePasswordFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { newPassword } = watch();

  const inputs = useMemo(
    () => ({
      oldPassword: {
        label: t('oldPasswordTitle', { ns: 'common' }),
        name: 'oldPassword' as const,
        type: 'password',
        placeholder: '',
        defaultValue: oldPassword || '',
        rules: {
          required: t('oldPasswordRequired', { ns: 'common' }),
        },
      },
      newPassword: {
        label: t('newPasswordTitle', { ns: 'common' }),
        name: 'newPassword' as const,
        type: 'password',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('newPasswordRequired', { ns: 'common' }),
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },
        },
      },
      passwordConfirm: {
        name: 'passwordConfirm' as const,
        label: t('confirmPasswordTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('confirmPasswordRequired', { ns: 'common' }),
          validate: (value: string) =>
            value === newPassword || t('confirmNotMatch', { ns: 'common' }),
        },
      },
    }),
    [t, newPassword, oldPassword]
  );

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
      <Controller
        control={control}
        name={inputs.oldPassword.name}
        rules={inputs.oldPassword.rules}
        defaultValue={inputs.oldPassword.defaultValue}
        render={({ field }) => (
          <WBTextField
            {...field}
            type={isOldVisible ? 'text' : 'password'}
            ref={oldPasswordInput}
            label={inputs.oldPassword.label}
            autoComplete="current-password"
            rightIcon={showHidePassword(isOldVisible, setIsOldVisible)}
            error={!!(errors.oldPassword && errors.oldPassword.message)}
            helperText={
              (errors.oldPassword && errors.oldPassword.message) || ''
            }
            margin="dense"
          />
        )}
      />

      <Controller
        control={control}
        name={inputs.newPassword.name}
        rules={inputs.newPassword.rules}
        defaultValue={inputs.newPassword.defaultValue}
        render={({ field }) => (
          <WBTextField
            {...field}
            type={isNewVisible ? 'text' : 'password'}
            inputRef={newPasswordInput}
            label={inputs.newPassword.label}
            autoComplete="new-password"
            rightIcon={showHidePassword(isNewVisible, setIsNewVisible)}
            error={!!(errors.newPassword && errors.newPassword.message)}
            helperText={
              (errors.newPassword && errors.newPassword.message) || ''
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
            inputRef={passwordConfirmInput}
            label={inputs.passwordConfirm.label}
            autoComplete="new-password"
            rightIcon={showHidePassword(isConfirmVisible, setIsConfirmVisible)}
            error={!!(errors.passwordConfirm && errors.passwordConfirm.message)}
            helperText={
              (errors.passwordConfirm && errors.passwordConfirm.message) || ''
            }
            margin="dense"
          />
        )}
      />

      <input hidden type="text" autoComplete="username" />

      {authError?.code && (
        <WBAlert
          title={t(authError.code, { ns: 'authentication' })}
          severity="error"
        />
      )}

      <WBButton
        loading={authStatus === 'submitting'}
        sx={{
          mt: 1,
          alignSelf: 'flex-start',
        }}
      >
        {t('updateTitle', { ns: 'common' })}
      </WBButton>
    </WBForm>
  );
};

export default ChangePasswordForm;
