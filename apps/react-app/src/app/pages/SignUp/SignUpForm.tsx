import { useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  REGEX,
  PASSWORD_POLICY,
  SIGNUP_CODE_CHARS,
  RequestStatus,
  TERMS_CONDITIONS_URL,
  PRIVACY_POLICY_URL,
} from '@admiin-com/ds-common';
import {
  WBAlert,
  WBButton,
  WBFlex,
  WBForm,
  WBIconButton,
  WBLink,
  WBModal,
  WBPhInput,
  WBTelInput,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { OAuthButton } from '../../components/OAuthButton/OAuthButton';
import { matchIsValidTel } from 'mui-tel-input';
import { VerifyStep } from './SignUp';
import AdmiinLogo from '../../components/AdmiinLogo/AdmiinLogo';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  code: string;
}

interface SignUpFormProps {
  authError: any;
  authStatus: RequestStatus;
  codeDelivery: string;
  verifyStep: VerifyStep;
  onSubmit: SubmitHandler<any>;
  onResendCode: () => void;
  onGetCodePress: (phone: string) => void;
}

const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);
const hasSymbol = (value: string) => /[^A-Za-z0-9]/.test(value);

const SignUpForm = ({
  authError,
  authStatus,
  codeDelivery,
  onGetCodePress,
  onSubmit,
  verifyStep,
  onResendCode,
}: SignUpFormProps) => {
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInput = useRef(null);

  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
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
      phone: {
        label: t('mobileTitle', { ns: 'common' }),
        name: 'phone',
        placeholder: '',
        defaultValue: '',
        rules: { validate: matchIsValidTel },
      },
      password: {
        label: t('passwordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: t('passwordPlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },

          validate: {
            lowercase: (value: string) =>
              PASSWORD_POLICY.lowercase
                ? hasLowercase(value) ||
                  'Password must include at least one lowercase letter'
                : true,
            uppercase: (value: string) =>
              PASSWORD_POLICY.uppercase
                ? hasUppercase(value) ||
                  'Password must include at least one uppercase letter'
                : true,
            number: (value: string) =>
              PASSWORD_POLICY.numbers
                ? hasNumber(value) ||
                  'Password must include at least one number'
                : true,
            symbol: (value: string) =>
              PASSWORD_POLICY.symbols
                ? hasSymbol(value) ||
                  'Password must include at least one symbol'
                : true,
          },
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        type: 'number',
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
   * Reset code field and trigger resend new code
   */
  const onResendCodePress = async () => {
    setValue('code', '');

    onResendCode();
  };

  return (
    <>
      <WBModal
        open={showInfo}
        onClose={() => setShowInfo(false)}
        sx={{ width: '95%' }}
      >
        <WBFlex flexDirection="column">
          <WBTypography variant="h3">
            {t('brandInfoTitle', { ns: 'signUp' })}
          </WBTypography>
          <WBTypography>
            {t('brandInfoDescription', { ns: 'signUp' })}
          </WBTypography>

          <WBTypography variant="h3" mt={3}>
            {t('journalistInfoTitle', { ns: 'signUp' })}
          </WBTypography>
          <WBTypography>
            {' '}
            {t('journalistInfoDescription', { ns: 'signUp' })}
          </WBTypography>
        </WBFlex>
      </WBModal>
      <WBFlex
        alignItems="center"
        width={{
          xs: '80%',
          sm: '80%',
          md: '60%',
          lg: '60%',
        }}
        flexDirection={'column'}
      >
        {verifyStep === 'EMAIL' ? (
          <WBFlex mt={2} justifyContent={'start'} width={'100%'}>
            <AdmiinLogo />
          </WBFlex>
        ) : null}
        <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
          {verifyStep === 'PHONE' && (
            <Controller
              name={inputs.phone.name}
              defaultValue={inputs.phone.defaultValue}
              control={control}
              rules={inputs.phone.rules}
              render={({ field, fieldState }) => (
                <WBTelInput
                  {...field}
                  variant="standard"
                  helperText={
                    fieldState.invalid
                      ? t('invalidMobile', { ns: 'common' })
                      : ''
                  }
                  autoFocus
                  error={fieldState.invalid}
                  focusOnSelectCountry
                  defaultCountry="AU"
                  label={inputs.phone.label}
                  margin="dense"
                />
                // <WBPhInput
                //   {...field}
                //   defaultCountry="AU"
                //   error={fieldState.invalid}
                //   autoFocus
                //   label={inputs.phone.label}
                // />
              )}
            />
          )}
          {verifyStep === 'CODE' && (
            <Controller
              control={control}
              name={inputs.code.name}
              rules={inputs.code.rules}
              defaultValue={inputs.code.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  autoFocus
                  type={inputs.code.type}
                  label={inputs.code.label}
                  //placeholder={inputs.email.placeholder}
                  error={!!(errors.code && errors.code.message)}
                  helperText={
                    ((errors.code && errors.code.message) || '') as string
                  }
                  rightIcon={
                    <WBLink
                      variant="body2"
                      underline="always"
                      textAlign="right"
                      type="button"
                      width={120}
                      onClick={onResendCodePress}
                    >
                      {t('resendCodeTitle', { ns: 'common' })}
                    </WBLink>
                  }
                  margin="dense"
                />
              )}
            />
          )}
          {verifyStep === 'EMAIL' && (
            <>
              <Controller
                control={control}
                name={inputs.email.name}
                rules={inputs.email.rules}
                defaultValue={inputs.email.defaultValue}
                render={({ field }) => (
                  <WBTextField
                    {...field}
                    autoFocus
                    type={inputs.email.type}
                    label={inputs.email.label}
                    placeholder={inputs.email.placeholder}
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
                    placeholder={inputs.password.placeholder}
                    rightIcon={
                      <WBIconButton
                        size="small"
                        sx={{ opacity: isPasswordVisible ? 1 : 0.1 }}
                        icon={isPasswordVisible ? 'EyeOff' : 'Eye'}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    }
                    error={!!(errors.password && errors.password.message)}
                    helperText={
                      ((errors.password &&
                        errors.password.message) as string) || ''
                    }
                    margin="dense"
                  />
                )}
              />
            </>
          )}
          {authError?.code && (
            <WBAlert
              title={
                i18n.exists(authError.code)
                  ? t(authError.code, { ns: 'authentication' })
                  : authError?.message
              }
              severity="error"
            />
          )}

          <WBFlex mb={1}>
            <WBButton
              sx={{ mt: 6 }}
              fullWidth
              loading={authStatus === 'submitting'}
            >
              {verifyStep === 'EMAIL' && t('proceedTitle', { ns: 'common' })}
              {verifyStep === 'PHONE' && t('getCodeTitle', { ns: 'common' })}
              {verifyStep === 'CODE' && t('signUpTitle', { ns: 'common' })}
            </WBButton>
          </WBFlex>
          {verifyStep === 'EMAIL' ? <OAuthButton /> : null}

          {verifyStep === 'EMAIL' && (
            <WBTypography
              mb={1}
              mt={3}
              variant="body2"
              fontWeight="regular"
              color="GrayText"
              textAlign="center"
            >
              {t('signUpAgreeTo', { ns: 'signUp' })}{' '}
              <WBLink
                href={TERMS_CONDITIONS_URL}
                target="_blank"
                underline="always"
                variant="body2"
                sx={{ color: 'inherit', fontWeight: 'inherit' }}
                color="text.primary"
              >
                {t('termsConditionsTitle', { ns: 'common' })}
              </WBLink>{' '}
              {t('and', { ns: 'signUp' })}{' '}
              <WBLink
                href={PRIVACY_POLICY_URL}
                target="_blank"
                underline="always"
                variant="body2"
                sx={{ color: 'inherit', fontWeight: 'inherit' }}
                color="text.primary"
              >
                {t('privacyPolicyTitle', { ns: 'common' })}
              </WBLink>
            </WBTypography>
          )}
        </WBForm>
      </WBFlex>
    </>
  );
};

export default SignUpForm;
