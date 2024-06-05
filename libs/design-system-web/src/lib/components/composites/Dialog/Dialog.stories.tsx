import type { Meta } from '@storybook/react';
import { Dialog } from './Dialog';

const Story: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'composites/Dialog',
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
