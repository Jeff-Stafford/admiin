import React from 'react';
import {
  LinearProgress as MUILinearProgress,
  LinearProgressProps as MUILinearProgressProps,
} from '@mui/material';

export const ProgressBar = (props: MUILinearProgressProps) => {
  return <MUILinearProgress {...props} />;
};
