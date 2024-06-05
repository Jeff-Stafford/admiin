import type { Meta } from '@storybook/react';
import { DialogContent } from './DialogContent';

const Story: Meta<typeof DialogContent> = {
  component: DialogContent,
  title: 'composites/DialogContent',
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
