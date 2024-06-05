import type { Meta } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const Story: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: 'composites/ProgressBar',
};
export default Story;

export const Primary = {
  args: {},
};

export const Determinate = {
  args: {
    progress: 75,
    variant: 'determinate',
  },
};

export const Colour = {
  args: {
    color: 'success',
  },
};
