import React from 'react';
import {
  CardMedia as MUICardMedia,
  CardMediaProps as MUICardMediaProps,
} from '@mui/material';

export const CardMedia = (props: MUICardMediaProps) => {
  return <MUICardMedia {...props} />;
};
