import React from 'react';
import {
  TableContainer as MUITableContainer,
  TableContainerProps as MUITableContainerProps,
} from '@mui/material';

export const TableContainer = (props: MUITableContainerProps) => {
  return <MUITableContainer {...props} />;
};
