import type { Meta } from '@storybook/react';
import { SideNav } from './SideNav';

const Story: Meta<typeof SideNav> = {
  component: SideNav,
  title: 'composites/SideNav',
};
export default Story;

export const Primary = {
  args: {
    paths: [
      { to: '/dashboard', title: 'Dashboard', icon: 'Home' },
      { to: '/settings', title: 'Settings', icon: 'Settings' },
    ],
  },
};
