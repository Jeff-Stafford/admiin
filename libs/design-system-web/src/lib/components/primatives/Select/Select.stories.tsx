import type { Meta } from '@storybook/react';
import { Select } from './Select';

const Story: Meta<typeof Select> = {
  component: Select,
  title: 'primatives/Select',
};
export default Story;

export const Primary = {
  args: {
    type: 'select',
    label: 'Favourite colour?',
    options: [
      {
        label: 'Red',
        value: 'red',
      },
      {
        label: 'Blue',
        value: 'blue',
      },
    ],
  },
};
