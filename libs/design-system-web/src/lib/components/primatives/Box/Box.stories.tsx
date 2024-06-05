import type { Meta } from '@storybook/react';
import { Box } from './Box';

const Story: Meta<typeof Box> = {
  component: Box,
  title: 'primatives/Box',
};
export default Story;

export const Primary = {
  args: {},
};

export const WithChildren = {
  args: { children: "i'm inside a box" },
};
