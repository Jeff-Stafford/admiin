import type { Meta } from '@storybook/react';
import { Flex } from './Flex';

const Story: Meta<typeof Flex> = {
  component: Flex,
  title: 'primatives/Flex',
};
export default Story;

export const Primary = {
  args: {},
};

export const AlignCenter = {
  args: {
    justifyContent: 'center',
    alignItems: 'center',
    children: "i'm justified and aligned centered",
  },
};
