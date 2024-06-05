import type { Meta } from '@storybook/react';
import { DynamicInput } from './DynamicInput';

//TODO: add hooks to manage state
//render: () => {
//  const [value, setValue]  = useState(0)
//}

const Story: Meta<typeof DynamicInput> = {
  component: DynamicInput,
  title: 'composites/DynamicInput',
};
export default Story;

export const Text = {
  args: {
    type: 'text',
  },
};

export const Radio = {
  args: {
    type: 'radio',
    label: 'Favourite colour?',
    placeholder: 'Favourite colour?',
    options: [
      {
        label: 'Red',
        value: 'red',
      },
      {
        label: 'Blue',
        value: 'blue',
      },
      {
        label: 'Green',
        value: 'green',
      },
    ],
  },
};

export const Select = {
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

export const Checkbox = {
  args: {
    type: 'checkbox',
    label: 'Remember me?',
  },
};

export const InputError = {
  args: {
    type: 'text',
    error: 'This field is required',
  },
};
