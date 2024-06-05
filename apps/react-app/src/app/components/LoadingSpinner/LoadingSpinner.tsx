import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';

/* eslint-disable-next-line */
export interface LoadingSpinnerProps {}

const StyledLoadingSpinner = styled.div`
  color: pink;
`;

export function LoadingSpinner(props: LoadingSpinnerProps) {
  return <CircularProgress color="inherit" size={20} />;
}

export default LoadingSpinner;
