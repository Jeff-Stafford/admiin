import {
  Radio as MUIRadio,
  RadioProps as MUIRadioProps,
  FormControlLabel,
} from '@mui/material';
import React from 'react';

interface RadioProps extends MUIRadioProps {
  label?: string;
}
export const Radio = ({ label, ...props }: RadioProps) => {
  return (
    <FormControlLabel control={<MUIRadio {...props} />} label={label || ''} />
  );
};
