import React from 'react';
import {
  MenuItem as MUIMenuItem,
  MenuItemProps as MUIMenuItemProps,
} from '@mui/material';

export const MenuItem = (props: MUIMenuItemProps) => {
  return <MUIMenuItem {...props} />;
};
