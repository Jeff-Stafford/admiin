import { WBBox } from '@admiin-com/ds-web';
import { styled } from '@mui/material';

/* eslint-disable-next-line */
export interface FormErrorProps {}

export const FormError = styled(WBBox)(({ theme }) => ({
  display: 'inline-block',
  color: theme.palette.error.main,
  // backgroundColor: '#ffe6e6',
  fontSize: '14px',
}));
