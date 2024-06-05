import type { Meta } from '@storybook/react';
import { AppBar } from './AppBar';

const Story: Meta<typeof AppBar> = {
  component: AppBar,
  title: 'composites/AppBar',
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
