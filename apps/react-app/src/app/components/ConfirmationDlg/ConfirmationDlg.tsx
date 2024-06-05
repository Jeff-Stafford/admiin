import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { WBButton } from '@admiin-com/ds-web';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
export interface ConfirmationDialogProps {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onOK: () => void;
  title: string;
}

function ConfirmationDlg(props: ConfirmationDialogProps) {
  const { onClose, title, children, open, onOK, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onOK();
    onClose();
  };

  return (
    <SimpleDrawDlg open={open} handleClose={onClose}>
      <DialogTitle variant="h4">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <WBButton autoFocus variant="outlined" onClick={handleCancel}>
          Cancel
        </WBButton>
        <WBButton onClick={handleOk}>Ok</WBButton>
      </DialogActions>
    </SimpleDrawDlg>
  );
}
export default ConfirmationDlg;
