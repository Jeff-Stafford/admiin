import React from 'react';
import { Card as MUICard, CardProps as MUICardProps } from '@mui/material';

export const Card = ({ variant = 'outlined', ...props }: MUICardProps) => {
  return <MUICard {...props} />;
};
