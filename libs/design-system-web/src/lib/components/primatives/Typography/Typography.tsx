import React from 'react';
import {
  Typography as MUITypography,
  TypographyProps as MUITypographyProps,
} from '@mui/material';

export const Typography = ({
  variant = 'body1',
  textAlign = 'left',
  color = 'text.primary',
  ...props
}: MUITypographyProps<any>) => {
  return (
    <MUITypography
      variant={variant}
      textAlign={textAlign}
      color={color}
      {...props}
    ></MUITypography>
  );
};
