import type { Meta } from '@storybook/react';
import { StoryLogoDark } from '../../../../storybook/StoryLogoDark';
import { OldNavigation } from './OldNavigation';

const navigation1 = [
  { label: 'Investment Strategy', href: 'https://google.com' },
  { label: 'Pricing', href: 'https://google.com' },
  { label: 'Why Kosec', href: 'https://google.com' },
  { label: 'Kosec Founder', href: 'https://google.com' },
];

const navigation2 = [
  {
    label: 'Log in',
    ButtonProps: { variant: 'text', textColor: 'text.primary' },
  },
  {
    label: 'Sign Up',
    ButtonProps: { variant: 'contained', size: 'large' },
  },
];

const Story: Meta<typeof OldNavigation> = {
  component: OldNavigation,
  title: 'deprecated/OldNavigation',
};
export default Story;

export const Basic = {
  args: {
    logo: <StoryLogoDark />,
    navigation1,
    navigation2,
  },
};

export const DesktopDark = {
  args: {
    ...Basic.args,
    color: 'secondary',
  },
};

export const MobileDark = {
  args: {
    ...DesktopDark.args,
    forceMobile: true,
  },
};

export const MobileLight = {
  args: {
    ...Basic.args,
    forceMobile: true,
  },
};

export const ResponsiveLight = {
  args: {
    ...Basic.args,
    mobileNavigation: { color: '#CA993B' },
  },
  parameters: {
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small mobile',
          styles: {
            height: '568px',
            width: '320px',
          },
          type: 'mobile',
        },
      },
      defaultViewport: 'mobile1',
    },
  },
};
