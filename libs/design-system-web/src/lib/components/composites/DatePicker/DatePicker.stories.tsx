import type { Meta } from '@storybook/react';
import { DatePicker } from './DatePicker';

const Story: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'composites/DatePicker',
};
export default Story;

export const Primary = {
  args: {},
};
