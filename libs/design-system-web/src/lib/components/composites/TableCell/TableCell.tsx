import React from 'react';
import {
  TableCell as MUITableCell,
  TableCellProps as MUITableCellProps,
} from '@mui/material';

export const TableCell = (props: MUITableCellProps) => {
  return <MUITableCell {...props} />;
};
