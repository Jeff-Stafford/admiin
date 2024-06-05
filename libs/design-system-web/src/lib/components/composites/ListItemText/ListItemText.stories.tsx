import type { Meta } from '@storybook/react';
import { Typography } from '../../primatives/Typography/Typography';
import { ListItemText } from './ListItemText';

const Story: Meta<typeof ListItemText> = {
  component: ListItemText,
  title: 'composites/ListItemText',
};
export default Story;

export const Primary = {
  args: {
    primary: 'Laoreet Varius Nisi',
    secondary: (
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
    ),
  },
};
