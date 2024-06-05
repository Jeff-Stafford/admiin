import type { Meta } from '@storybook/react';
import { Typography } from '../../primatives/Typography/Typography';
import { Container } from './Container';

const Story: Meta<typeof Container> = {
  component: Container,
  title: 'composites/Container',
};
export default Story;

export const Primary = {
  args: {},
};

export const Content = {
  args: {
    children: (
      <>
        <Typography variant="h1">Pellentesque habitant morbi</Typography>
        <Typography>
          Maecenas sodales sed neque a dictum. Sed purus ante, ullamcorper in
          semper sit amet, luctus id nisi. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </Typography>
      </>
    ),
  },
};

export const Fluid = {
  args: {
    ...Content.args,
    maxWidth: 'xs',
  },
};

export const Fixed = {
  args: {
    ...Content.args,
    fixed: true,
  },
};
