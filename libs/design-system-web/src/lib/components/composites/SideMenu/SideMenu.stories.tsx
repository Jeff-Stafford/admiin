import type { Meta } from '@storybook/react';
import { StoryLogoDark } from '../../../../storybook/StoryLogoDark';
import { SideMenu } from './SideMenu';

const Story: Meta<typeof SideMenu> = {
  component: SideMenu,
  title: 'composites/SideMenu',
};
export default Story;

const navigation1 = [
  {
    label: 'Home',
    href: '/home',
    icon: 'Briefcase',
  },
];

const navigation2 = [
  {
    label: 'Sign in',
    href: '/sign-in',
  },
];

export const Primary = {
  args: {
    logo: <StoryLogoDark />,
    color: 'secondary',
    navigation1,
    navigation2,
  },
};
