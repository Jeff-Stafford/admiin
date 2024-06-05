import { keyframes } from '@mui/material';

export const bounce = keyframes`
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(1.1, .9) translateY(0);
  }
  30% {
    transform: scale(.9, 1.1) translateY(-20px);
  }
  50% {
    transform: scale(1, 1) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(-7px);
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
`;
