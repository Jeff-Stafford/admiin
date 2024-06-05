import type { Meta } from '@storybook/react';
import { Radio } from './Radio';

const Story: Meta<typeof Radio> = {
  component: Radio,
  title: 'primatives/Radio',
};
export default Story;

export const Primary = {
  args: {
    label: 'Red',
    value: 'red',
    onChange: (e) => console.log('event: ', e),
  },
};
