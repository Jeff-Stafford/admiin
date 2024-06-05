import type { Meta } from '@storybook/react';
import { Chip } from './Chip';

const Story: Meta<typeof Chip> = {
  component: Chip,
  title: 'primatives/Chip',
};
export default Story;

export const Primary = {
  args: {
    label: 'Chip',
  },
};

export const Variant = {
  args: {
    ...Primary.args,
    variant: 'Chip',
  },
};
