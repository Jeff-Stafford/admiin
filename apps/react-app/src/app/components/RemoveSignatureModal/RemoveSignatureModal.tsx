import React, { useCallback } from 'react';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { WBButton } from '@admiin-com/ds-web';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { useTranslation } from 'react-i18next';
import { gql, useMutation } from '@apollo/client';
import {
  deleteSignature as DELETE_SIGNATURE,
  getUser as GET_USER,
  Signature,
} from '@admiin-com/ds-graphql';

export interface RemoveSignatureModalProps {
  open: boolean;
  handleClose: () => void;
  signature?: Signature;
}

export function RemoveSignatureModal({
  open,
  signature,
  handleClose,
}: RemoveSignatureModalProps) {
  const { t } = useTranslation();
  const [deleteSignature, { loading, error }] = useMutation(
    gql(DELETE_SIGNATURE),
    {
      refetchQueries: [gql(GET_USER)],
    }
  );

  const handleRemove = useCallback(async () => {
    if (!signature) return;
    await deleteSignature({
      variables: {
        input: {
          userId: signature.userId,
          createdAt: signature.createdAt,
        },
      },
    });
    handleClose();
  }, [deleteSignature, handleClose, signature]);

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" variant="h4">
        {t('removeSignature', { ns: 'settings' })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('confirmRemoveSignature', { ns: 'settings' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WBButton variant="outlined" onClick={handleClose}>
          {t('cancelTitle', { ns: 'common' })}
        </WBButton>
        <WBButton loading={loading} onClick={handleRemove} autoFocus>
          {t('okTitle', { ns: 'common' })}
        </WBButton>
        <ErrorHandler errorMessage={error?.message} />
      </DialogActions>
    </SimpleDrawDlg>
  );
}

export default RemoveSignatureModal;
