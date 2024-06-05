import type { Meta } from '@storybook/react';
import { Textarea } from './Textarea';

const Story: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'primatives/TextArea',
};
export default Story;

export const Primary = {
  args: {
    rows: 6,
    label: 'Enter biography',
  },
};

export const FullWidth = {
  args: {
    ...Primary.args,
    fullWidth: true,
  },
};
