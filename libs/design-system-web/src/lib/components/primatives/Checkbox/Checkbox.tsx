import {
  Checkbox as MUICheckbox,
  CheckboxProps as MUICheckboxProps,
  FormControlLabel,
} from '@mui/material';
import React from 'react';

interface CheckboxProps extends MUICheckboxProps {
  label?: string | React.ReactNode;
}

export const Checkbox = React.forwardRef<any, CheckboxProps>(
  ({ label, ...props }: CheckboxProps, ref) => {
    return (
      <FormControlLabel
        sx={{
          whiteSpace: 'pre-wrap',
        }}
        control={<MUICheckbox ref={ref} {...props} />}
        label={label || ''}
      />
    );
  }
);
