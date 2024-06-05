import { Avatar } from '@mui/material';
import type { Meta } from '@storybook/react';
import { ListItemAvatar } from './ListItemAvatar';

const Story: Meta<typeof ListItemAvatar> = {
  component: ListItemAvatar,
  title: 'composites/ListItemAvatar',
};
export default Story;

export const Primary = {
  args: {
    children: (
      <Avatar
        alt="John Doe"
        src="https://images.unsplash.com/photo-1654110455429-cf322b40a906"
      />
    ),
  },
};
