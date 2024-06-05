import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WBBox, WBButton, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import VerificationIcon from '../../../assets/icons/verfication.svg';
import React from 'react';

/* eslint-disable-next-line */
export interface VerificationStartProps {
  onSuccess: () => void;
}

export function VerificationStart({ onSuccess }: VerificationStartProps) {
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        {t('verificationRequired', {
          ns: 'common',
        })}
        <WBTypography variant="body1" mt={3}>
          {t('verificationRequiredBody', {
            ns: 'common',
          })}
        </WBTypography>
      </DialogTitle>
      <DialogContent>
        <WBBox mb={4}></WBBox>
      </DialogContent>
      <DialogActions>
        <WBButton
          fullWidth
          color="success"
          sx={{ color: 'black', py: 1.5, fontWeight: 'bold' }}
          onClick={() => {
            onSuccess();
          }}
        >
          <WBSvgIcon fontSize="small" sx={{ mr: 1 }}>
            <VerificationIcon />
          </WBSvgIcon>
          {t('startVerificationProcess', { ns: 'common' })}
        </WBButton>
      </DialogActions>
    </>
  );
}

export default VerificationStart;
