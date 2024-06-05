import type { Meta } from '@storybook/react';
import { Divider } from './Divider';

const Story: Meta<typeof Divider> = {
  component: Divider,
  title: 'composites/Divider',
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
