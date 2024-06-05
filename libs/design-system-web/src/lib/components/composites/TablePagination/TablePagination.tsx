import React from 'react';
import {
  TablePagination as MUITablePagination,
  TablePaginationProps as MUITablePaginationProps,
} from '@mui/material';

export const TablePagination = (props: MUITablePaginationProps) => {
  return <MUITablePagination {...props} />;
};
