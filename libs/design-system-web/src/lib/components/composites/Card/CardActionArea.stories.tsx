import type { Meta } from '@storybook/react';
import React from 'react';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';
import { Typography } from '../../primatives/Typography/Typography';
import { CardActionArea } from './CardActionArea';
import { CardContent } from './CardContent';
import { CardMedia } from './CardMedia';

const Story: Meta<typeof CardActionArea> = {
  component: CardActionArea,
  title: 'composites/CardActionArea',
};
export default Story;

export const Primary = {
  args: {
    children: <CardActionArea />,
  },
};

export const WithChildren = {
  args: {
    children: (
      <CardActionArea>
        <CardMedia
          sx={{ height: 130, maxWidth: '100%' }}
          image={IMG_LOGO}
          title="Mauris nulla ipsum"
        />
        <CardContent>
          <Typography variant="h4">Pellentesque habitant morbi</Typography>
          <Typography>
            Maecenas sodales sed neque a dictum. Sed purus ante, ullamcorper in
            semper sit amet, luctus id nisi. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit
          </Typography>
        </CardContent>
      </CardActionArea>
    ),
  },
};
