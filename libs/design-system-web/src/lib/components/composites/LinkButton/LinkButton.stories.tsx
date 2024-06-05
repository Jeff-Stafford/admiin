import type { Meta } from '@storybook/react';
import { LinkButton } from './LinkButton';

const Story: Meta<typeof LinkButton> = {
  component: LinkButton,
  title: 'composites/LinkButton',
};
export default Story;

export const Primary = {
  args: {
    onClick: (e) => console.log('Link button clicked: ', e),
    children: 'Delete account',
  },
};
