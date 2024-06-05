import type { Meta } from '@storybook/react';
import { Accordion } from './Accordion';

const Story: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'composites/Accordion',
};
export default Story;

export const Basic = {
  args: {
    items: [
      {
        title: 'Lorem ipsum is placeholder text commonly',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
    ],
  },
};

export const Exclusive = {
  args: {
    ...Basic.args,
    exclusive: true,
  },
};

export const NoToggle = {
  args: {
    ...Exclusive.args,
    AccordionItemProps: { showToggle: false },
  },
};

export const Icon = {
  args: {
    ...Exclusive.args,
    items: [
      {
        icon: 'Briefcase',
        title: 'Lorem ipsum is placeholder text commonly',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        icon: 'Briefcase',
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        icon: 'Briefcase',
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        icon: 'Briefcase',
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
      {
        icon: 'Briefcase',
        title: 'Adipiscing elit pellentesque habitant morbi tristique',
        body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
      },
    ],
  },
};

export const Responsive = {
  args: {
    ...Icon.args,
    AccordionItemProps: { showToggle: false }, //TODO remove to see result
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
