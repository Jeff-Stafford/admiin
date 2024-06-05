import { useTheme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';
import { Box } from '../../primatives/Box/Box';
export const IphoneDevice = ({ children, ...other }: PropsWithChildren) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
        padding: '14px',
        width: '224px',
        height: '480px',
        borderRadius: '42px',
        position: 'relative',
      }}
      {...other}
    >
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          height: '100%',
          borderRadius: '30px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '110px',
            height: '14px',
            position: 'absolute',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            zIndex: 4,
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            left: '50%',
            transform: 'translate(-50%, 0%)',
          }}
        />
        {children}
      </Box>
    </Box>
  );
};
