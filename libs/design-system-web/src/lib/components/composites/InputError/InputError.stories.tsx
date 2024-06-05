import type { Meta } from '@storybook/react';
import { InputError } from './InputError';

const Story: Meta<typeof InputError> = {
  component: InputError,
  title: 'composites/InputError',
};
export default Story;

export const Primary = {
  args: {
    helperText: 'Invalid email address',
  },
};
