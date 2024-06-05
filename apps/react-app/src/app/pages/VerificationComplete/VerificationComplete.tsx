import { WBButton, WBFlex, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { DialogActions, DialogContent } from '@mui/material';
import { t } from 'i18next';
import SecurityIcon from '../../../assets/icons/security.svg';
import React from 'react';

/* eslint-disable-next-line */
export interface VerificationCompleteProps {
  onClose: () => void;
}

export function VerificationComplete({ onClose }: VerificationCompleteProps) {
  React.useEffect(() => {
    setTimeout(onClose, 3000);
  }, [onClose]);
  return (
    <>
      <DialogContent>
        <WBFlex
          justifyContent="center"
          alignItems={'center'}
          flexDirection={'column'}
        >
          <WBSvgIcon
            fontSize="large"
            viewBox="0 0 40 40"
            sx={{ width: '2em', height: '2em' }}
          >
            <SecurityIcon />
          </WBSvgIcon>
          <WBTypography my={3} variant="h3">
            {t('businessVerified', { ns: 'common' })}
          </WBTypography>
          <WBTypography mb={4} textAlign={'center'}>
            {t('businessVerifiedSubtitle', { ns: 'common' })}
          </WBTypography>
        </WBFlex>
      </DialogContent>
      <DialogActions>
        <WBButton fullWidth onClick={onClose}>
          {t('close', { ns: 'common' })}
        </WBButton>
      </DialogActions>
    </>
  );
}

export default VerificationComplete;
