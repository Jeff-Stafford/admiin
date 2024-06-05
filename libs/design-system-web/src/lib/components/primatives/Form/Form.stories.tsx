import type { Meta } from '@storybook/react';
import { Form } from './Form';

const Story: Meta<typeof Form> = {
  component: Form,
  title: 'primatives/Form',
};
export default Story;

export const Primary = {
  args: {
    onSubmit: (e) => console.log('on submit: ', e),
    children: (
      <>
        <input name="firstName" value="John" />
        <input name="surname" value="Smith" />
      </>
    ),
  },
};
