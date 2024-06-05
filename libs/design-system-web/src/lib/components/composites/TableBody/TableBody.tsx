import React from 'react';
import {
  TableBody as MUITableBody,
  TableBodyProps as MUITableBodyProps,
} from '@mui/material';

export const TableBody = (props: MUITableBodyProps) => {
  return <MUITableBody {...props} />;
};
