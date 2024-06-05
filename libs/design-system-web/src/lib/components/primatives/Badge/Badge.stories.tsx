import type { Meta } from '@storybook/react';
import { Badge } from './Badge';

const Story: Meta<typeof Badge> = {
  component: Badge,
  title: 'primatives/Badge',
};
export default Story;

export const NoPadding = {
  args: {
    disablePadding: true,
  },
};

export const Dense = {
  args: {
    dense: true,
  },
};

export const Subheader = {
  args: {
    subheader: 'Settings',
  },
};
