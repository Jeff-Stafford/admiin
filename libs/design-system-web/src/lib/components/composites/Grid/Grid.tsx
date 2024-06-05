import React, { forwardRef } from 'react';
import {
  Unstable_Grid2 as MUIGrid,
  Grid2Props as MUIGridProps,
} from '@mui/material';

export const Grid = forwardRef<HTMLDivElement, MUIGridProps>((props, ref) => {
  return <MUIGrid ref={ref} {...props} />;
});
