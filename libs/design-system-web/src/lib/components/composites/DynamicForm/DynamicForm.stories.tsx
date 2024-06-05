import type { Meta } from '@storybook/react';
import { DynamicInputType } from '../DynamicInput/DynamicInput';
import { DynamicForm } from './DynamicForm';

const Story: Meta<typeof DynamicForm> = {
  component: DynamicForm,
  title: 'composites/DynamicForm',
};
export default Story;

export const Primary = {
  args: {
    btnTitle: 'Submit',
    inputs: [
      {
        type: DynamicInputType.checkbox,
        label: 'Active?',
        name: 'active',
        placeholder: '',
        rules: {},
      },
      {
        type: DynamicInputType.text,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
        rules: {},
      },
      {
        type: DynamicInputType.select,
        label: 'Sort By',
        name: 'sortBy',
        placeholder: 'Select option',
        options: [
          {
            label: 'Oldest first',
            value: 'oldest',
          },
          {
            label: 'Newest first',
            value: 'newest',
          },
        ],
        rules: {},
      },
      {
        type: DynamicInputType.radio,
        label: 'Favourite Color',
        name: 'colour',
        placeholder: '',
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
        rules: {},
      },
    ],
  },
};
