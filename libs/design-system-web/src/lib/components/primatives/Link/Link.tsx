import React from 'react';
import { Link as MUILink, LinkProps as MUILinkProps } from '@mui/material';

export interface LinkProps extends MUILinkProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  to?: string | number;
  replace?: boolean;
}

export const Link = ({
  style = {},
  variant = 'body1',
  underline = 'hover',
  color = 'primary.main',
  textAlign = 'left',
  fontWeight = 600,
  ...other
}: LinkProps) => {
  return (
    <MUILink
      color={color}
      style={style}
      underline={underline}
      variant={variant}
      textAlign={textAlign}
      fontWeight={fontWeight}
      {...other}
    >
      {other.children}
    </MUILink>
  );
};
