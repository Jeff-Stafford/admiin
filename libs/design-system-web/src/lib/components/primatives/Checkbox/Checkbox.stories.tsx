import type { Meta } from '@storybook/react';
import { Checkbox } from './Checkbox';

const Story: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'primatives/Checkbox',
};
export default Story;

export const Label = {
  args: {
    label: 'Remember me?',
  },
};

export const Disabled = {
  args: {
    ...Label.args,
    disabled: true,
  },
};

export const Size = {
  args: {
    ...Label.args,
    size: 'large',
  },
};

export const Color = {
  args: {
    ...Label.args,
    color: 'secondary',
  },
};
