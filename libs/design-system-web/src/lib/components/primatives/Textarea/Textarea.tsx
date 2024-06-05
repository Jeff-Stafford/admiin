import React from 'react';
import {
  TextField,
  TextFieldProps,
} from '../../composites/TextField/TextField';
export const Textarea = (props: TextFieldProps) => {
  return <TextField multiline {...props} />;
};
