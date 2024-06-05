import type { Meta } from '@storybook/react';
import React from 'react';
import { Button } from '../../primatives/Button/Button';
import { Typography } from '../../primatives/Typography/Typography';
import { IconButton } from '../IconButton/IconButton';
import { Card } from './Card';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';
import { CardActionArea } from './CardActionArea';
import { CardActions } from './CardActions';
import { CardContent } from './CardContent';
import { CardMedia } from './CardMedia';

const Story: Meta<typeof Card> = {
  component: Card,
  title: 'composites/Card',
};
export default Story;

export const Primary = {
  args: {
    sx: {
      maxWidth: 355,
    },
  },
};

export const FullCard = {
  args: {
    ...Primary.args,
    children: (
      <>
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
        <CardActions>
          <IconButton icon="Heart" size="small" />
          <Button size="small" variant="text">
            View more
          </Button>
          <Button size="small" variant="text" color="error">
            Delete
          </Button>
        </CardActions>
      </>
    ),
  },
};

export const ActionCard = {
  args: {
    ...Primary.args,
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

export const SupplementalActionCard = {
  args: {
    ...Primary.args,
    children: (
      <>
        <CardActionArea>
          <CardMedia
            sx={{ height: 130, maxWidth: '100%' }}
            image={IMG_LOGO}
            title="Mauris nulla ipsum"
          />
          <CardContent>
            <Typography variant="h4">Pellentesque habitant morbi</Typography>
            <Typography>
              Maecenas sodales sed neque a dictum. Sed purus ante, ullamcorper
              in semper sit amet, luctus id nisi. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton icon="Heart" size="small" />
          <Button size="small" variant="text">
            View more
          </Button>
          <Button size="small" variant="text" color="error">
            Delete
          </Button>
        </CardActions>
      </>
    ),
  },
};
