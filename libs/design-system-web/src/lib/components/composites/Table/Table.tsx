import React from 'react';
import { Table as MUITable, TableProps as MUITableProps } from '@mui/material';

export const Table = (props: MUITableProps) => {
  return <MUITable {...props} />;
};
