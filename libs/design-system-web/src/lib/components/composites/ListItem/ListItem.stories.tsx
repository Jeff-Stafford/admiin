import { Avatar } from '@mui/material';
import type { Meta } from '@storybook/react';
import React from 'react';
import { Icon } from '../../primatives/Icon/Icon';
import { Typography } from '../../primatives/Typography/Typography';
import { ListItemAvatar } from '../ListItemAvatar/ListItemAvatar';
import { ListItemButton } from '../ListItemButton/ListItemButton';
import { ListItemIcon } from '../ListItemIcon/ListItemIcon';
import { ListItemText } from '../ListItemText/ListItemText';
import { ListItem } from './ListItem';

const Story: Meta<typeof ListItem> = {
  component: ListItem,
  title: 'composites/ListItem',
};
export default Story;

//TODO: Avatar component in design system

export const IconText = {
  args: {
    children: (
      <ListItemButton>
        <ListItemIcon>
          <Icon name="Mail" />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItemButton>
    ),
  },
};

export const AlignListItem = {
  args: {
    alignItems: 'flex-start',
    children: (
      <>
        <ListItemAvatar>
          <Avatar
            alt="John Doe"
            src="https://images.unsplash.com/photo-1654110455429-cf322b40a906"
          />
        </ListItemAvatar>
        <ListItemText
          primary="Laoreet Varius Nisi"
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                John Doe
              </Typography>
              {
                ' — Vestibulum suscipit massa vel hendrerit rutrum. Nunc fringilla nisi arcu, nec pharetra nulla dapibus ac'
              }
            </>
          }
        />
      </>
    ),
  },
};

export const DisableGutters = {
  args: {
    ...AlignListItem.args,
    disableGutters: true,
  },
};
