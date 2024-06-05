import { Box, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { MouseEventHandler, ReactNode } from 'react';

interface LinkButtonProps {
  onClick?: MouseEventHandler;
  children: ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

export const LinkButton = ({
  children,
  color = 'primary',
  sx = {},
  onClick,
}: LinkButtonProps) => {
  return (
    <Box
      component="span"
      onClick={onClick}
      color={color}
      fontWeight={600}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
