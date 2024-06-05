import { MFA_ISSUER } from '@admiin-com/ds-common';
import {
  WBBox,
  WBButton,
  WBChip,
  WBFlex,
  WBForm,
  WBLink,
  WBTextField,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  AlertColor,
  CircularProgress,
  DialogContent,
  DialogTitle,
  alpha,
  useTheme,
} from '@mui/material';
import { useClipboard } from '@admiin-com/ds-hooks';

/* eslint-disable-next-line */
export interface MfaFormProps {}

export function MfaForm(props: MfaFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    setValue,
    reset,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [code, setCode] = useState<string | undefined>();

  console.log(code);
  useEffect(() => {
    const checkMFA = async () => {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);

      if (user) {
        setMfaEnabled(user.preferredMFA === 'SOFTWARE_TOKEN_MFA');
      }
    };

    checkMFA();
  }, []);

  const theme = useTheme();

  const setUp2Fa = async () => {
    setLoading(true);

    try {
      const user = await Auth.currentAuthenticatedUser();
      const code = await Auth.setupTOTP(user);
      setCode(code);
      setTwoFACode(
        `otpauth://totp/AWSCognito:${user.username}?secret=${code}&issuer=${MFA_ISSUER} (${user.attributes.email})`
      );
    } catch (err) {
      console.log('ERROR onSetUp2Fa: ', err);
    }
    setLoading(false);
  };

  const verify2fa = async ({ challengeAnswer }: any) => {
    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.verifyTotpToken(user, challengeAnswer);
      await Auth.setPreferredMFA(user, 'TOTP');
      const updatedUser = await Auth.currentAuthenticatedUser();
      setMfaEnabled(updatedUser.preferredMFA === 'SOFTWARE_TOKEN_MFA');
      setOpen(false);
      reset();
    } catch (err: any) {
      console.log('ERROR verify2fa: ', err);
      setError('challengeAnswer', { type: 'validate', message: err.message });
    }
    setLoading(false);
  };

  const disable2Fa = async () => {
    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.setPreferredMFA(user, 'NOMFA');
      setMfaEnabled(false);
    } catch (err) {
      console.log('ERROR onSetUp2Fa: ', err);
    }
    setLoading(false);
  };

  const [clipboard, copy] = useClipboard();
  const [open, setOpen] = React.useState<boolean>(false);

  const showSnackBar = useSnackbar();

  const copyCode = async () => {
    try {
      if (code) await copy(code);
      showSnackBar({
        message: t('codeCopied', { ns: 'settings' }),
        severity: 'success' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    } catch (error) {
      console.log(error);
      showSnackBar({
        message: t('errorOcurred', { ns: 'settings' }),
        severity: 'danger' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    }
  };
  return (
    <>
      <WBBox mt={5}>
        {!mfaEnabled && (
          <WBButton
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => setOpen(true)}
          >
            {t('add', { ns: 'settings' })}
          </WBButton>
        )}
        {mfaEnabled && (
          <WBFlex
            width="100%"
            py={3}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderBottom={`1px solid ${theme.palette.grey[300]}`}
          >
            <WBTypography mb={0} variant="h5" fontWeight={'medium'}>
              {t('googleAuthenticator', { ns: 'settings' })}
            </WBTypography>
            <WBFlex justifyContent={'space-between'} alignItems={'center'}>
              <WBChip
                label={t('enabled', { ns: 'settings' })}
                sx={{
                  fontSize: '10px',
                  mr: 3,
                  mb: 0,
                  textTransform: 'uppercase',
                  bgcolor: 'common.black',
                  color: 'common.white',
                }}
              />
              <WBLink
                underline="always"
                sx={{ color: 'error.main' }}
                // loading={loading}
                component={'button'}
                color="error"
                variant="body2"
                onClick={
                  loading
                    ? () => {
                        console.log('loading');
                      }
                    : disable2Fa
                }
              >
                {loading ? (
                  <CircularProgress size={15} />
                ) : (
                  `- ${t('remove', { ns: 'settings' })}`
                )}
              </WBLink>
            </WBFlex>
          </WBFlex>
        )}
      </WBBox>
      <SimpleDrawDlg
        maxWidth="xs"
        open={open}
        handleClose={() => setOpen(false)}
      >
        <DialogTitle variant="h3" fontWeight={'bold'}>
          {t('twoFactor', {
            ns: 'settings',
          })}
        </DialogTitle>
        <DialogContent>
          <WBForm
            onSubmit={handleSubmit(verify2fa)}
            sx={{ mt: 0, justifyContent: 'space-between' }}
          >
            {!twoFACode && !mfaEnabled && (
              <WBBox>
                <WBTypography variant="h4">
                  1. {t('download2faApp', { ns: 'authentication' })}
                </WBTypography>
                <WBTypography>
                  {t('googleAuthenticatorDownload', { ns: 'authentication' })}{' '}
                  <WBLink
                    href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                    target="_blank"
                    rel="noopener"
                  >
                    {t('iOS', { ns: 'common' })}{' '}
                    {t('appStore', { ns: 'common' })}
                  </WBLink>{' '}
                  {t('or', { ns: 'common' })}{' '}
                  <WBLink
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noopener"
                  >
                    Android {t('playStore', { ns: 'common' })}
                  </WBLink>
                </WBTypography>
              </WBBox>
            )}
            {twoFACode && !mfaEnabled && (
              <WBBox>
                <WBTypography variant="h4">
                  2. {t('scanQrCode', { ns: 'authentication' })}
                </WBTypography>
                <WBBox>
                  <WBFlex justifyContent="left" mt={2}>
                    <QRCode value={twoFACode} />
                  </WBFlex>

                  <WBTypography mt={2}>
                    {t('copyVerificationCode', { ns: 'authentication' })}
                  </WBTypography>
                  {code && (
                    <WBFlex
                      mt={2}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <WBTypography
                        noWrap
                        mr={3}
                        sx={{
                          p: 1.5,
                          bgcolor: alpha(theme.palette.common.black, 0.1),
                        }}
                      >
                        {code}
                      </WBTypography>
                      <WBLink
                        flex={1}
                        component={'button'}
                        type="button"
                        sx={{ width: '90px' }}
                        color="primary.main"
                        variant="body2"
                        underline="always"
                        onClick={(e) => {
                          e.preventDefault();
                          copyCode();
                        }}
                      >
                        {t('copyCode', { ns: 'authentication' })}
                      </WBLink>
                    </WBFlex>
                  )}
                </WBBox>

                <WBBox mt={3}>
                  <WBTypography variant="h4">
                    3. {t('enter2faCode', { ns: 'authentication' })}
                  </WBTypography>
                  <WBTypography>
                    {t('enter2fa6DigitCode', { ns: 'authentication' })}
                  </WBTypography>
                  <Controller
                    control={control}
                    name="challengeAnswer"
                    rules={{
                      required: t('challengeAnswerRequired', {
                        ns: 'authentication',
                      }),
                    }}
                    defaultValue={''}
                    render={({ field: { ref, ...field } }) => (
                      <WBTextField
                        {...field}
                        error={
                          !!(
                            errors.challengeAnswer &&
                            errors.challengeAnswer.message
                          )
                        }
                        helperText={
                          ((errors.challengeAnswer &&
                            errors.challengeAnswer.message) as string) || ''
                        }
                        placeholder={t('challengeAnswerPlaceholder', {
                          ns: 'authentication',
                        })}
                        rightIcon={
                          <WBLink
                            component={'button'}
                            color="primary.main"
                            variant="body2"
                            sx={{ width: '90px' }}
                            underline="always"
                            onClick={(e) => {
                              e.preventDefault();
                              setValue('challengeAnswer', clipboard);
                            }}
                          >
                            {t('pasteCode', { ns: 'authentication' })}
                          </WBLink>
                        }
                        sx={{ mt: 3 }}
                      />
                    )}
                  />
                </WBBox>
              </WBBox>
            )}
            {mfaEnabled && (
              <WBTypography>
                {t('2faIsEnabled', { ns: 'authentication' })}
              </WBTypography>
            )}
            {!mfaEnabled && (
              <WBButton
                sx={{ mt: 3, alignSelf: 'flex-start' }}
                loading={loading}
                disabled={!!twoFACode && !isValid}
                onClick={() =>
                  twoFACode ? handleSubmit(verify2fa) : setUp2Fa()
                }
              >
                {twoFACode
                  ? t('submitTitle', { ns: 'common' })
                  : t('continueTitle', { ns: 'common' })}
              </WBButton>
            )}

            {mfaEnabled && (
              <WBButton
                sx={{ mt: 3, alignSelf: 'flex-start' }}
                loading={loading}
                color="error"
                onClick={disable2Fa}
              >
                {t('disableTitle', { ns: 'common' })}
              </WBButton>
            )}
          </WBForm>
        </DialogContent>
      </SimpleDrawDlg>
    </>
  );
}

export default MfaForm;
