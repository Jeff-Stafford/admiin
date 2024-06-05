import {
  AuthError,
  RequestStatus,
  SIGNUP_CODE_CHARS,
} from '@admiin-com/ds-common';
import {
  WBAlert,
  WBButton,
  WBLink,
  WBTextField,
  useSnackbar,
} from '@admiin-com/ds-web';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Auth } from 'aws-amplify';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  AlertColor,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { i18n } from '../../i18n';
import { EmailInput } from './EmailInput';
import { PhoneInput } from './PhoneInput';
import { gql, useMutation, useQuery } from '@apollo/client';
import { updateUser as UPDATE_USER } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { updateUserAttributes } from '@admiin-com/ds-amplify';
/* eslint-disable-next-line */
export interface CodeVerificationFormProps {
  type: 'email' | 'phone';
}

export function CodeVerificationForm({ type }: CodeVerificationFormProps) {
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
  const [codeSent, setCodeSent] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const codeType = type === 'email' ? 'email' : 'phone_number';
  const updateName = `${type}`;

  const inputs = {
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

  const sendCode = async () => {
    await trigger(updateName);
    if (errors[updateName]) return;
    onResendCodePress();
  };
  const showSnackbar = useSnackbar();

  const onResendCodePress = async () => {
    setAuthError({});
    setAuthStatus('submitting');
    const user = await Auth.currentAuthenticatedUser();
    try {
      await Auth.updateUserAttributes(user, {
        [codeType]: watch(updateName),
      });
      setCodeSent(true);
      setAuthStatus('idle');
      showSnackbar({
        message: t('codeSent', { ns: 'settings' }),
        severity: 'success' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    } catch (err: any) {
      setAuthStatus('error');
      setAuthError(err);
    }
  };
  const { data: subData, loading: loadingSub } = useQuery(gql(GET_SUB));

  const sub = subData?.sub;

  const [updateUser, { error: updateUserError, loading: updatingUser }] =
    useMutation(gql(UPDATE_USER));
  const confirmEmail = async () => {
    await trigger(inputs.code.name);
    if (errors.code) return;
    setAuthStatus('loading');
    try {
      await Auth.verifyCurrentUserAttributeSubmit(codeType, watch('code'));
      await updateUser({
        variables: {
          input: {
            id: sub,
            [codeType === 'phone_number' ? 'phone' : 'email']:
              watch(updateName),
          },
        },
      });
      const user = await Auth.currentAuthenticatedUser();
      await updateUserAttributes(user, { [codeType]: watch(updateName) });
      setAuthStatus('success');
      setAuthError({});
      setCodeSent(false);
      showSnackbar({
        message: t(type === 'phone' ? 'phoneUpdated' : 'emailUpdated', {
          ns: 'settings',
        }),
        severity: 'success' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
      handleClose();
    } catch (error: any) {
      setAuthError(error);
      setAuthStatus('error');
      console.log('Error verify', error);
    }
  };

  const handleClose = () => {
    setEdit(false);
    setCodeSent(false);
    setValue('code', '');
    setAuthStatus('idle');
    setAuthError({});
    setValue(updateName, watch(`original_${updateName}`), {
      shouldValidate: true,
    });
  };
  const editButton = (
    <WBLink
      variant="body2"
      color="primary.main"
      mr={2}
      underline="always"
      onClick={() => setEdit(true)}
    >
      {t('edit', { ns: 'settings' })}
    </WBLink>
  );

  return (
    <>
      {type === 'email' ? (
        <EmailInput fixed disabled rightIcon={editButton} />
      ) : (
        <PhoneInput fixed disabled rightIcon={editButton} />
      )}
      <SimpleDrawDlg
        open={edit}
        handleClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle variant="h3" fontWeight={'bold'}>
          {t(type === 'email' ? 'changeEmail' : 'changePhone', {
            ns: 'settings',
          })}
        </DialogTitle>
        <DialogContent>
          {type === 'email' ? (
            <EmailInput disabled={codeSent || authStatus === 'success'} />
          ) : (
            <PhoneInput disabled={codeSent || authStatus === 'success'} />
          )}
          {codeSent && (
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
        </DialogContent>
        <DialogActions>
          <WBButton onClick={handleClose} variant="outlined">
            {t('cancel', { ns: 'settings' })}
          </WBButton>
          {authStatus !== 'success' ? (
            codeSent ? (
              <WBButton
                type="submit"
                onClick={confirmEmail}
                disabled={authStatus === 'submitting'}
                loading={authStatus === 'loading'}
              >
                {t('confirm', { ns: 'settings' })}
              </WBButton>
            ) : (
              <WBButton
                type="button"
                onClick={sendCode}
                loading={authStatus === 'submitting'}
              >
                {t('Send Code', { ns: 'settings' })}
              </WBButton>
            )
          ) : null}
        </DialogActions>
      </SimpleDrawDlg>
    </>
  );
}

export default CodeVerificationForm;
