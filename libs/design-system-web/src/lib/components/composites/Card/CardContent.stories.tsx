import type { Meta } from '@storybook/react';
import React from 'react';
import { Typography } from '../../primatives/Typography/Typography';
import { CardContent } from './CardContent';

const Story: Meta<typeof CardContent> = {
  component: CardContent,
  title: 'composites/CardContent',
};
export default Story;

export const Primary = {
  args: {
    children: (
      <>
        <Typography variant="h4">Pellentesque habitant morbi</Typography>
        <Typography>
          Maecenas sodales sed neque a dictum. Sed purus ante, ullamcorper in
          semper sit amet, luctus id nisi. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </Typography>
      </>
    ),
  },
};
