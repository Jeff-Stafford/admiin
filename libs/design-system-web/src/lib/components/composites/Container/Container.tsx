import React from 'react';
import {
  Container as MUIContainer,
  ContainerProps as MUIContainerProps,
} from '@mui/material';
export const Container = (props: MUIContainerProps) => {
  return <MUIContainer {...props} />;
};
