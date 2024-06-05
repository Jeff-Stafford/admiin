import type { Meta } from '@storybook/react';
import { IconButton } from '../IconButton/IconButton';
import { ImageListItemBar } from './ImageListItemBar';

const Story: Meta<typeof ImageListItemBar> = {
  component: ImageListItemBar,
  title: 'composites/ImageListItemBar',
};
export default Story;

export const Primary = {
  args: {
    title: 'Volkswagen',
  },
};

export const Position = {
  args: {
    ...Primary.args,
    position: 'top',
  },
};

export const Icon = {
  args: {
    ...Position.args,
    actionIcon: (
      <IconButton
        icon="Heart"
        sx={{ color: 'white' }}
        aria-label={`Favourite Volkswagen`}
      />
    ),
  },
};
