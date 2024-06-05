import React from 'react';
import {
  DatePicker as MUIDatePicker,
  DatePickerProps as MUIDatePickerProps,
} from '@mui/x-date-pickers';

export const DatePicker = <TDate,>({
  label,
  value,
  onChange,
  format = 'dd/MM/yyyy',
  ...other
}: MUIDatePickerProps<TDate>) => {
  return (
    <MUIDatePicker
      label={label}
      value={value}
      onChange={onChange}
      format={format}
      {...other}
      slotProps={{ textField: { variant: 'outlined' } }}
    />
  );
};
