import React from 'react';
import {
  Autocomplete as MUIAutocomplete,
  AutocompleteProps as MUIAutocompleteProps,
} from '@mui/material';

export const Autocomplete = <T,>(
  props: MUIAutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >
) => {
  return (
    <MUIAutocomplete
      //value={value}
      //options={options}
      //autoComplete={autoComplete}
      //multiple={multiple}
      //renderInput={renderInput}
      //onChange={(_e, data) => onChange(data)}
      disablePortal
      {...props}
    />
  );
};
