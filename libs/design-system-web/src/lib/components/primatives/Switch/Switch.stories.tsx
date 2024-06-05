import type { Meta } from '@storybook/react';
import { Switch } from './Switch';

const Story: Meta<typeof Switch> = {
  component: Switch,
  title: 'primatives/Switch',
};
export default Story;

export const Primary = {
  args: {
    label: 'Notifications enabled',
  },
};
