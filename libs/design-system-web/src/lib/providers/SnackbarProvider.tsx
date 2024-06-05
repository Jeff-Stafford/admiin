import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { AlertColor, AlertTitle } from '@mui/material';
import { Snackbar } from '../components/composites/Snackbar/Snackbar';
import { WBAlert, WBBox } from '../components';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose?: () => void;
  title?: string;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
  autoHideDuration: number;
}

interface SnackbarProviderProps {
  children: ReactNode;
  autoHideDuration?: number;
}

interface SnackbarProps {
  message: string;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  severity?: AlertColor;
  onClose?: () => void;
  title?: string;
}

type ShowSnackbarHandler = (props: SnackbarProps) => void;

const defaultState: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
  vertical: 'top',
  horizontal: 'center',
  title: '',
  autoHideDuration: 4000,
};

const SnackbarContext = createContext<ShowSnackbarHandler>(() => {
  throw new Error('useSnackbar must be used within a SnackbarProvider');
});

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  autoHideDuration = 4000,
}) => {
  const [state, setState] = useState<SnackbarState>(defaultState);

  const showSnackbar: ShowSnackbarHandler = useCallback(
    ({
      message,
      severity = 'success',
      horizontal = 'center',
      vertical = 'top',
      onClose,
      title = '',
    }) => {
      setState({
        open: true,
        message,
        severity,
        horizontal,
        vertical,
        title,
        onClose,
        autoHideDuration,
      });
    },
    [autoHideDuration]
  );

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    state.onClose?.();
    setState((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Snackbar
        open={state.open}
        anchorOrigin={{
          vertical: state.vertical,
          horizontal: state.horizontal,
        }}
        autoHideDuration={state.autoHideDuration}
        onClose={handleClose}
      >
        <WBBox>
          <WBAlert
            variant="outlined"
            icon={false}
            onClose={handleClose}
            severity={state.severity}
          >
            {state.title ? <AlertTitle>{state.title}</AlertTitle> : null}
            {state.message}
          </WBAlert>
        </WBBox>
      </Snackbar>
      <SnackbarContext.Provider value={showSnackbar}>
        {children}
      </SnackbarContext.Provider>
    </>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
