import React from 'react';
import { Typography } from '../../primatives/Typography/Typography';
//TODO: children instead of helper text prop?
export interface InputErrorProps {
  helperText: string;
}

export const InputError = ({ helperText = '' }: InputErrorProps) => {
  return <Typography color="error">{helperText}</Typography>;
};
