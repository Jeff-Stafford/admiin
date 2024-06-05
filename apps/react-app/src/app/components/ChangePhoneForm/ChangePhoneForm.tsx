import {
  AuthError,
  REGEX,
  RequestStatus,
  SIGNUP_CODE_CHARS,
} from '@admiin-com/ds-common';
import {
  WBAlert,
  WBButton,
  WBLink,
  WBTelInput,
  WBTextField,
} from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CSGetSub as GET_SUB, getUser } from '@admiin-com/ds-graphql';
import React, { useMemo } from 'react';
import { Auth } from 'aws-amplify';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { i18n } from '../../i18n';
import { matchIsValidTel } from 'mui-tel-input';
/* eslint-disable-next-line */
export interface ChangePhoneFormProps {}

export function ChangePhoneForm(props: ChangePhoneFormProps) {
  const {
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const [authError, setAuthError] = React.useState<AuthError>({});
  const [authStatus, setAuthStatus] = React.useState<RequestStatus>('idle');
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;
  const [codeSent, setCodeSent] = React.useState<boolean>(false);

  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });

  const user = useMemo(() => userData?.getUser || {}, [userData]);

  const inputs = {
    phone: {
      label: t('phone', { ns: 'contacts' }),
      name: 'phone' as const,
      type: 'text',
      placeholder: t('phonePlaceholder', { ns: 'contacts' }),
      defaultValue: '',
      rules: {
        validate: (value: string | null | undefined) =>
          value === null ||
          value === undefined ||
          value === '' ||
          matchIsValidTel(value) ||
          t('invalidPhone', { ns: 'common' }),
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
  };

  React.useEffect(() => {
    if (user.phone) {
      setValue('phone', user.phone, { shouldValidate: true });
    }
  }, [user, setValue]);

  const sendCode = async () => {
    trigger(inputs.phone.name);
    if (errors.phone) return;
    setCodeSent(true);
    onResendCodePress();
  };

  const onResendCodePress = async () => {
    setAuthError({});
    const user = await Auth.currentAuthenticatedUser();
    try {
      const result = await Auth.updateUserAttributes(user, {
        phone_number: watch('phone'),
      });
      setAuthStatus('success');
    } catch (err: any) {
      setAuthStatus('error');
    }
  };

  const confirmphone = async () => {
    trigger(inputs.code.name);
    if (errors.code) return;
    setAuthStatus('submitting');
    try {
      const result = await Auth.verifyCurrentUserAttributeSubmit(
        'phone_number',
        watch('code')
      );
      setAuthStatus('success');
      setCodeSent(false);
    } catch (error: any) {
      setAuthError(error);
      setAuthStatus('error');
      console.log('Error verify', error);
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={inputs.phone.name}
        //@ts-ignore
        rules={inputs.phone.rules}
        defaultValue={inputs.phone.defaultValue}
        render={({ field, fieldState }) => (
          //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
          <WBTelInput
            {...field}
            variant="standard"
            helperText={
              fieldState.invalid ? t('invalidPhone', { ns: 'common' }) : ''
            }
            error={fieldState.invalid}
            focusOnSelectCountry
            defaultCountry="AU"
            label={inputs.phone.label}
            margin="dense"
            disabled
            rightIcon={
              <WBLink
                variant="body2"
                color="primary.main"
                mr={2}
                underline="always"
                onClick={sendCode}
              >
                {t('edit', { ns: 'settings' })}
              </WBLink>
            }
          />
        )}
      />
      <SimpleDrawDlg
        open={codeSent}
        handleClose={() => {
          setCodeSent(false);
        }}
      >
        <DialogTitle variant="h3" fontWeight={'bold'}>
          {t('Verification Code is sent', {
            ns: 'settings',
          })}
        </DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            name={inputs.code.name}
            //@ts-ignore
            rules={inputs.code.rules}
            defaultValue={inputs.code.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <WBTextField
                {...field}
                type={inputs.code.type}
                label={inputs.code.label}
                error={!!(errors.code && errors.code.message)}
                helperText={
                  ((errors.code && errors.code.message) as string) || ''
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
        </DialogContent>
        <DialogActions>
          <WBButton
            onClick={confirmphone}
            loading={authStatus === 'submitting'}
          >
            {t('confirm', { ns: 'settings' })}
          </WBButton>
        </DialogActions>
      </SimpleDrawDlg>
    </>
  );
}

export default ChangePhoneForm;
