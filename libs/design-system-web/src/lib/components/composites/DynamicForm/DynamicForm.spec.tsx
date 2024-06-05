import { DynamicInputType } from '../DynamicInput/DynamicInput';
import { render } from '@testing-library/react';

import { DynamicForm } from './DynamicForm';

const onSubmit = async (data: { active: string }) => {
  console.log('Dynamic form data: ', data);
};

const inputs = [
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
    placeholder: 'Select sort',
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
];

describe('DynamicForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DynamicForm
        btnTitle="Submit"
        inputs={inputs}
        loading={false}
        onSubmit={onSubmit}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
