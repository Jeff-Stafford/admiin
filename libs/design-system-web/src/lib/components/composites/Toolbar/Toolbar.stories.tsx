import type { Meta } from '@storybook/react';
import { Toolbar } from './Toolbar';

const Story: Meta<typeof Toolbar> = {
  component: Toolbar,
  title: 'composites/Toolbar',
};
export default Story;

export const Primary = {
  args: {},
};

//TODO: vertical not showing
export const Orientation = {
  args: {
    orientation: 'vertical',
  },
};

export const WithText = {
  args: {
    children: 'Hello world',
  },
};

export const VerticalWithText = {
  args: {
    ...Orientation.args,
    children: 'Hello world',
  },
};
