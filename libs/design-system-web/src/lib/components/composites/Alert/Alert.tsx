import React from 'react';
import {
  Alert as MUIAlert,
  AlertTitle as MUIAlertTitle,
  AlertProps as MUIAlertProps,
} from '@mui/material';

export interface AlertProps extends MUIAlertProps {
  title?: string;
}

export const Alert = ({
  severity,
  title,
  onClose,
  children,
  sx,
}: AlertProps) => {
  return (
    <MUIAlert severity={severity} onClose={onClose} sx={sx}>
      {title && <MUIAlertTitle>{title}</MUIAlertTitle>}
      {children}
    </MUIAlert>
  );
};
