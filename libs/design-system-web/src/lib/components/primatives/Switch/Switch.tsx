import React from 'react';
import {
  Switch as MUISwitch,
  SwitchProps as MUISwitchProps,
} from '@mui/material';

interface SwitchProps extends MUISwitchProps {
  label: string;
}
export const Switch = ({ label, ...props }: SwitchProps) => {
  return <MUISwitch {...props} />;
};
