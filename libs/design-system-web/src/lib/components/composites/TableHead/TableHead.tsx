import React from 'react';
import {
  TableHead as MUITableHead,
  TableHeadProps as MUITableHeadProps,
} from '@mui/material';

export const TableHead = (props: MUITableHeadProps) => {
  return <MUITableHead {...props} />;
};
