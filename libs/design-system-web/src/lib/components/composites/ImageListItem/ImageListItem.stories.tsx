import type { Meta } from '@storybook/react';
import React from 'react';
import { ImageListItemBar } from '../ImageListItemBar/ImageListItemBar';
import { ImageListItem } from './ImageListItem';

const Story: Meta<typeof ImageListItem> = {
  component: ImageListItem,
  title: 'composites/ImageListItem',
};
export default Story;

export const Primary = {
  args: {},
  children: (
    <img
      src="https://images.unsplash.com/photo-1511125357779-27038c647d9d"
      alt="Volkswagen"
    />
  ),
};

export const WithBar = {
  args: {},
  children: (
    <ImageListItem>
      <img
        src="https://images.unsplash.com/photo-1511125357779-27038c647d9d"
        alt="Volkswagen"
      />
      <ImageListItemBar title="Volkswagen" />
    </ImageListItem>
  ),
};
