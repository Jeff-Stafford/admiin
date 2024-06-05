import type { Meta } from '@storybook/react';
import { Typography } from './Typography';

const Story: Meta<typeof Typography> = {
  component: Typography,
  title: 'primatives/Typography',
};
export default Story;

export const Primary = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
};

export const Variant = {
  args: {
    ...Primary.args,
    variant: 'h1',
  },
};

export const Color = {
  args: {
    ...Primary.args,
    color: 'primary',
  },
};

export const TextAlign = {
  args: {
    ...Primary.args,
    textAlign: 'center',
    render: (args) => (
      <>
        <Typography {...args} textAlign="left">
          Left
        </Typography>
        <Typography {...args} textAlign="center">
          Center
        </Typography>
        <Typography {...args} textAlign="right">
          Right
        </Typography>
      </>
    ),
  },
};
