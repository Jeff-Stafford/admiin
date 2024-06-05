import React from 'react';
import {
  ImageList as MUIImageList,
  ImageListProps as MUIImageListProps,
} from '@mui/material';

export const ImageList = (props: MUIImageListProps) => (
  <MUIImageList {...props}>{props.children}</MUIImageList>
);
