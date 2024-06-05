import type { Meta } from '@storybook/react';
import { Box } from '../Box/Box';
import { Button } from './Button';

//TODO: generate loop

const Story: Meta<typeof Button> = {
  component: Button,
  title: 'primatives/Button',
};
export default Story;

export const Color = {
  render: (args) => (
    <>
      <Button {...args} color="primary">
        Primary
      </Button>
      <Button {...args} color="secondary">
        Secondary
      </Button>
      <Button {...args} color="success">
        Success
      </Button>
      <Button {...args} color="error">
        Error
      </Button>
      <Button {...args} color="info">
        Info
      </Button>
      <Button {...args} color="warning">
        Warning
      </Button>
    </>
  ),
};

export const ContainedVariant = {
  args: {
    variant: 'contained',
    children: 'Contained',
  },
};

export const Sizes = {
  render: (args) => (
    <>
      <Button {...args} size="small">
        Small
      </Button>
      <Box mb={1} />
      <Button {...args} size="medium">
        Medium
      </Button>
      <Box mb={1} />
      <Button {...args} size="large">
        Large
      </Button>
    </>
  ),
};
