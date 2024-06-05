import { WBButton } from '@admiin-com/ds-web';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  EntityUser,
  deleteEntityUser as DELETE_ENTITY_USER,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { entityUsersByEntityId as ENTITY_USERS_BY_ENTITY_ID } from '@admiin-com/ds-graphql';
/* eslint-disable-next-line */
export interface RemoveEntityUserModalProps {
  open: boolean;
  handleClose: () => void;
  entityUser?: EntityUser;
}

export function RemoveEntityUserModal({
  open,
  entityUser,
  handleClose,
}: RemoveEntityUserModalProps) {
  const entityId = useCurrentEntityId();
  const { t } = useTranslation();
  const [deleteEntityUser, { loading, error }] = useMutation(
    gql(DELETE_ENTITY_USER),
    {
      refetchQueries: [
        {
          query: gql(ENTITY_USERS_BY_ENTITY_ID),
          variables: {
            entityId,
          },
        },
      ],
    }
  );

  const handleRemove = React.useCallback(async () => {
    if (!entityUser) return;
    await deleteEntityUser({
      variables: {
        input: {
          entityId,
          userId: entityUser.userId,
        },
      },
    });
    handleClose();
  }, [deleteEntityUser, handleClose, entityId, entityUser]);

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={false}
    >
      <DialogTitle id="alert-dialog-title" variant="h4">
        {t('removeEntityUser', { ns: 'settings' })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('confirmRemoveEntityUser', { ns: 'settings' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WBButton variant="outlined" onClick={handleClose}>
          {t('cancelTitle', { ns: 'common' })}
        </WBButton>
        <WBButton loading={loading} onClick={handleRemove} autoFocus>
          {t('okTitle', { ns: 'common' })}
        </WBButton>
      </DialogActions>
      <ErrorHandler errorMessage={error?.message} />
    </SimpleDrawDlg>
  );
}

export default RemoveEntityUserModal;
