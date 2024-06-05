import type { Meta } from '@storybook/react';
import React from 'react';
import { Button } from '../../primatives/Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { CardActions } from './CardActions';

const Story: Meta<typeof CardActions> = {
  component: CardActions,
  title: 'composites/CardActions',
};
export default Story;

export const Primary = {
  args: {
    children: (
      <>
        <IconButton icon="Heart" size="small" />
        <Button size="small" variant="text">
          View more
        </Button>
        <Button size="small" variant="text" color="error">
          Delete
        </Button>
      </>
    ),
  },
};
