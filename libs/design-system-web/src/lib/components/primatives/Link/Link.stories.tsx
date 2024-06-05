import type { Meta } from '@storybook/react';
import { Link } from './Link';

const Story: Meta<typeof Link> = {
  component: Link,
  title: 'primatives/Link',
};
export default Story;

export const Primary = {
  args: {},
};

export const Href = {
  args: {
    href: 'https://google.com',
    children: 'Google',
  },
};

export const Download = {
  args: {
    href: 'https://images.unsplash.com/photo-1558383331-f520f2888351',
    download: true,
    children: 'Download',
  },
};

export const NewTab = {
  args: {
    href: 'https://images.unsplash.com/photo-1558383331-f520f2888351',
    target: '_blank',
    children: 'Open in new tab',
  },
};
export const UnderlineAlways = {
  args: {
    href: 'https://images.unsplash.com/photo-1558383331-f520f2888351',
    underline: 'always',
    children: 'Always underline',
  },
};
