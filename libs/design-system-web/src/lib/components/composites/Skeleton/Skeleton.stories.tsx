import type { Meta } from '@storybook/react';
import { Typography } from '../../primatives/Typography/Typography';
import { Skeleton } from './Skeleton';

const Story: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'composites/Skeleton',
};
export default Story;

export const Primary = {
  args: {},
};

export const Circular = {
  args: {
    variant: 'circular',
    width: 50,
    height: 50,
  },
};

export const Text = {
  render: (args) => (
    <>
      <Typography variant="h1">
        <Skeleton {...args} />
      </Typography>
      <Typography variant="h3">
        <Skeleton {...args} />
      </Typography>
      <Typography>
        <Skeleton {...args} />
      </Typography>
    </>
  ),
};

export const NoAnimation = {
  args: {
    animation: false,
  },
};

export const Colour = {
  args: {
    sx: {
      bgcolor: 'grey.300',
    },
  },
};
