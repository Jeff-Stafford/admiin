import type { Meta } from '@storybook/react';
import React from 'react';
import { Icon } from '../../primatives/Icon/Icon';
import { ListItemIcon } from './ListItemIcon';

const Story: Meta<typeof ListItemIcon> = {
  component: ListItemIcon,
  title: 'composites/ListItemIcon',
};
export default Story;

export const Primary = {
  args: {
    children: <Icon name="Person" size="small" />,
  },
};
