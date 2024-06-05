import React from 'react';
import { BoxProps } from '@mui/material';
import { Box } from '../Box/Box';

interface ImageProps extends BoxProps {
  src: string;
  srcSet?: string; // srcSet="xxxx.png 1x, xxxx@2x.png 2x, xxxx@3x.png 3x"
  responsive?: boolean;
  stretchBackground?: boolean;
  sx?: object;
  alt?: string;
}

export const Image = ({
  alt,
  src,
  srcSet,
  stretchBackground = false,
  responsive = false,
  sx = {},
}: ImageProps) => {
  const stretchSxProps = !stretchBackground
    ? {}
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      };

  const responseSxProps = !responsive
    ? {}
    : {
        width: '100%',
        height: 'auto',
      };

  return (
    <Box
      component="img"
      src={src}
      //srcSet={srcSet}
      alt={alt}
      sx={{
        ...sx,
        ...stretchSxProps,
        ...responseSxProps,
      }}
    />
  );
};
