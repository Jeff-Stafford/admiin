/* eslint-disable-next-line */
import {
  Snackbar as MUISnackbar,
  SnackbarProps as MUISnackbarProps,
} from '@mui/material';

//export interface SnackBarProps extends MUISnackBarProps{}

export const Snackbar = (props: MUISnackbarProps) => <MUISnackbar {...props} />;

export default Snackbar;
