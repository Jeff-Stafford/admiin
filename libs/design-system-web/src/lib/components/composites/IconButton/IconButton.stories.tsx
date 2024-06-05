import type { Meta } from '@storybook/react';
import { IconButton } from './IconButton';

const Story: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'composites/IconButton',
};
export default Story;

export const Primary = {
  args: {
    icon: 'Menu',
  },
};
