import type { Meta } from '@storybook/react';
import { FullScreenModal } from './FullScreenModal';

const Story: Meta<typeof FullScreenModal> = {
  component: FullScreenModal,
  title: 'composites/FullScreenModal',
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
