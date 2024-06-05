import React from 'react';
import { Chip as MUIChip, ChipProps as MUIChipProps } from '@mui/material';

export const Chip = ({
  color = undefined,
  label,
  variant = 'filled',
  size = 'medium',
  onClick = undefined,
  onDelete = undefined,
  ...other
}: MUIChipProps) => {
  return (
    <MUIChip
      color={color}
      label={label}
      size={size}
      variant={variant}
      onClick={onClick}
      onDelete={onDelete}
      {...other}
    />
  );
};
