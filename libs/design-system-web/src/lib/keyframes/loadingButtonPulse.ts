import { keyframes } from '@mui/material';

export const loadingButtonPulse = (color: string) =>
  keyframes({
    '0%': {
      backgroundColor: color,
    },
    '50%': {
      backgroundColor: '#FFF',
    },
    '100%': {
      backgroundColor: color,
    },
  });
