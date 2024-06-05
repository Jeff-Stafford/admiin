import React from 'react';
import { Fade as MUIFade, FadeProps as MUIFadeProps } from '@mui/material';

export const Fade = ({ children, ...props }: MUIFadeProps) => (
  <MUIFade {...props}>{children}</MUIFade>
);
