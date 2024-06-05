import React, { forwardRef } from 'react';
import { Box as MUIBox, BoxProps as MUIBoxProps } from '@mui/material';

export const Flex = forwardRef(({ ...props }: MUIBoxProps, ref) => {
  return (
    <MUIBox ref={ref} display="flex" {...props}>
      {props.children}
    </MUIBox>
  );
});
