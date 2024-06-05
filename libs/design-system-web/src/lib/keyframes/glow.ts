import { keyframes } from '@emotion/react';

export const glow = (color: string) =>
  keyframes({
    '0%': {
      boxShadow: `0 4px 77px 20px ${color}`,
    },
    '50%': {
      boxShadow: `0 4px 77px 0 ${color}`,
    },
    '100%': {
      boxShadow: `0 4px 77px 20px ${color}`,
    },
  });
