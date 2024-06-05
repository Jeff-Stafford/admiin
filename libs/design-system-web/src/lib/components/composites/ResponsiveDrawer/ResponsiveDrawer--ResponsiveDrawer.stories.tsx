import { Avatar, Tooltip } from '@mui/material';
import type { Meta } from '@storybook/react';
import React from 'react';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';
import { Box } from '../../primatives/Box/Box';
import { Flex } from '../../primatives/Flex/Flex';
import { Typography } from '../../primatives/Typography/Typography';
import { IconButton } from '../IconButton/IconButton';
import { ResponsiveDrawer } from './ResponsiveDrawer';

const Story: Meta<typeof ResponsiveDrawer> = {
  component: ResponsiveDrawer,
  title: 'composites/ResponsiveDrawer',
};
export default Story;

export const Primary = {
  args: {
    logo: IMG_LOGO,
    drawerWidth: 250,
    paths: [
      { to: '/dashboard', title: 'Dashboard', icon: 'Home' },
      { to: '/settings', title: 'Settings', icon: 'Settings' },
    ],
    navRight: (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={console.log} sx={{ p: 0 }}>
            <Avatar alt="User profile" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    children: (
      <Flex
        flexDirection="column"
        component="main"
        flex={2}
        sx={{
          height: 'calc(100vh - 64px)',
          overflowY: 'scroll',
        }}
      >
        <Typography variant="h1">
          Praesent eu sem est. In in magna et nunc tristique sodales
        </Typography>
      </Flex>
    ),
  },
};
