import { Box as MUIBox, BoxProps } from '@mui/material';
import { forwardRef } from 'react';

export const Box = forwardRef(({ ...props }: BoxProps<any>, ref) => (
  <MUIBox ref={ref} {...props} />
));
