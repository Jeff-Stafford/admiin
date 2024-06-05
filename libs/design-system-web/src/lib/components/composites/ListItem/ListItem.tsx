import React from 'react';
import {
  ListItem as MUIListItem,
  ListItemProps as MUIListItemProps,
} from '@mui/material';

export interface ListItemProps extends MUIListItemProps {
  disc?: boolean | undefined;
  children: React.ReactNode;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ disc = false, children, sx, ...props }, ref) => {
    return (
      <MUIListItem
        ref={ref}
        sx={{
          ...(sx || {}),
          ...(disc && {
            position: 'relative',
            pl: 2.3,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'black',
              transform: 'translateY(-50%)',
            },
          }),
        }}
        {...props}
      >
        {children}
      </MUIListItem>
    );
  }
);
