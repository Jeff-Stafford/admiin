import React from 'react';
import {
  DataGrid as MUIDataGrid,
  DataGridProps as MUIDataGridProps,
} from '@mui/x-data-grid';

export const DataGrid = (props: MUIDataGridProps) => {
  return <MUIDataGrid {...props} />;
};
