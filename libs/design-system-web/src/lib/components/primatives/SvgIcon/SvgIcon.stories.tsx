import type { Meta } from '@storybook/react';
import { SvgIcon } from './SvgIcon';

const Story: Meta<typeof SvgIcon> = {
  component: SvgIcon,
  title: 'primatives/SvgIcon',
};
export default Story;

export const Primary = {
  args: {},
};

export const WithChildren = {
  args: { children: "i'm inside a SvgIcon" },
};
