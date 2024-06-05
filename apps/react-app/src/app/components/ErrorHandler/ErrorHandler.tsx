import { useSnackbar, WBAlert } from '@admiin-com/ds-web';
import { useEffect } from 'react';

export interface ErrorHandlerProps {
  errorMessage?: string;
  isDialog?: boolean;
}

export const ErrorHandler = ({ errorMessage, isDialog }: ErrorHandlerProps) => {
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (isDialog && errorMessage) {
      showSnackbar({
        message: errorMessage,
        severity: 'error',
      });
    }
  }, [errorMessage, isDialog, showSnackbar]);
  return (
    errorMessage &&
    !isDialog && (
      <WBAlert title={errorMessage} severity="error" sx={{ my: 2 }}>
        {/* {errorMessage} */}
      </WBAlert>
    )
  );
};

export default ErrorHandler;
