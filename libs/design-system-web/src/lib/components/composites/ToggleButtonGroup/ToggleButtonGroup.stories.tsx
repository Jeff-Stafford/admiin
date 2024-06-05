import type { Meta } from '@storybook/react';
import { ToggleButtonGroup } from './ToggleButtonGroup';

const Story: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
  title: 'composites/ToggleButtonGroup',
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
