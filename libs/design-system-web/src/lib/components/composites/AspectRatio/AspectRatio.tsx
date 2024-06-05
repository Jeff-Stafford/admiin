import React from 'react';
import { Box } from '../../primatives/Box/Box';
import { BoxProps } from '@mui/material';

export interface AspectRatioProps extends BoxProps {
  ratio?: number;
}

export const AspectRatio = React.forwardRef(
  ({ ratio = 4 / 3, children, sx = {}, ...props }: AspectRatioProps, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: 100 / ratio + '%',
          }}
        />
        <Box
          {...props}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...sx,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);
