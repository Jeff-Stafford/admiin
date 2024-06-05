import type { Meta } from '@storybook/react';
import { TextField } from './TextField';

const Story: Meta<typeof TextField> = {
  component: TextField,
  title: 'composites/TextField',
};
export default Story;
export const Placeholder = {
  args: {
    placeholder: 'Enter first name',
  },
};

export const ValueEntered = {
  args: {
    value: 'John Doe',
    name: 'firstName',
    label: 'First name',
  },
};

export const Disabled = {
  args: {
    ...ValueEntered.args,
    disabled: true,
  },
};

export const IconTextField = {
  args: {
    ...ValueEntered.args,
    icon: 'Menu',
  },
};

export const AssistiveText = {
  args: {
    ...ValueEntered.args,
    helperText: 'As shown on passport',
  },
};

export const Error = {
  args: {
    ...ValueEntered.args,
    errorMessage: 'Invalid first name',
  },
};

export const FullWidth = {
  args: {
    ...ValueEntered.args,
    fullWidth: true,
  },
};
