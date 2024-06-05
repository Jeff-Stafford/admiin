import type { Meta } from '@storybook/react';
import { List } from './List';

const Story: Meta<typeof List> = {
  component: List,
  title: 'primatives/List',
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
