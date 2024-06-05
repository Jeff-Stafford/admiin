import type { Meta } from '@storybook/react';
import React from 'react';
import { TextField } from '../TextField/TextField';
import { Autocomplete } from './Autocomplete';

const Story: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  title: 'composites/Autocomplete',
};
export default Story;

export const Primary = {
  args: {
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Yellow', value: 'yellow' },
    ],
    renderInput: (params) => (
      <TextField {...params} placeholder="Select a colour" label="Colour" />
    ),
  },
};

export const Multiple = {
  args: {
    ...Primary.args,
    multiple: true,
  },
};
