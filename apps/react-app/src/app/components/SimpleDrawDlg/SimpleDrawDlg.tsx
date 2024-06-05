import {
  WBDialog,
  WBDrawer,
  WBIconButton,
  useMediaQuery,
  useTheme,
} from '@admiin-com/ds-web';
import { DialogProps } from '@mui/material';

/* eslint-disable-next-line */
export interface SimpleDrawDlgProps extends DialogProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  noPadding?: boolean;
}

export function SimpleDrawDlg({
  children,
  open,
  handleClose,
  noPadding,
  ...props
}: SimpleDrawDlgProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return !isMobile ? (
    <WBDialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: { padding: noPadding ? 0 : 4 },
      }}
      sx={{
        display: { xs: 'none', sm: 'block' },
      }}
      {...props}
    >
      {children}
    </WBDialog>
  ) : (
    <WBDrawer
      anchor={'bottom'}
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: 2000,
        display: { xs: 'block', sm: 'none' },
      }}
      PaperProps={{
        sx: {
          width: '100%',
          display: 'flex',
          p: noPadding ? 0 : 2,
        },
      }}
    >
      {children}
    </WBDrawer>
  );
}

export default SimpleDrawDlg;
