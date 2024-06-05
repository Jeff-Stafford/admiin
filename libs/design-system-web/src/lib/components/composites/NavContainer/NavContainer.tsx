import { SxProps } from '@mui/system';
import React, { ReactNode } from 'react';
import {
  AppBar as MUIAppBar,
  PropTypes,
  Theme,
  Toolbar as MUIToolbar,
} from '@mui/material';

export interface NavContainerProps {
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  children?: ReactNode;
  color?: PropTypes.Color | 'transparent';
  disableGutters?: boolean;
  elevation?: number;
  enableColorOnDark?: boolean;
  variant?: 'regular' | 'dense';
  sx?: SxProps<Theme>;
}

export const NavContainer = ({
  position = 'fixed',
  disableGutters = false,
  children,
  color = 'transparent',
  elevation = 0,
  enableColorOnDark = true,
  variant = 'regular',
  sx = {},
}: NavContainerProps) => {
  return (
    <>
      <MUIAppBar
        position={position}
        elevation={elevation}
        enableColorOnDark={enableColorOnDark}
        color={color}
        sx={sx}
      >
        <MUIToolbar
          variant={variant}
          disableGutters={disableGutters}
          sx={{ justifyContent: 'space-between' }}
        >
          {children}
        </MUIToolbar>
      </MUIAppBar>
      <MUIToolbar />
    </>
  );
};
