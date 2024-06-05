import type { Meta } from '@storybook/react';
import React from 'react';
import { Flex } from '../../primatives/Flex/Flex';
import { Grid } from './Grid';

const posts = [
  'Nunc eros tortor, semper a vulputate vel, pretium a ipsum',
  'Proin bibendum facilisis feugiat',
  'vitae aliquam arcu commodo quis',
  'Donec cursus lacinia ullamcorper',
  'Curabitur semper consectetur faucibus',
  'Mauris tristique, erat eget laoreet mollis',
];

const Story: Meta<typeof Grid> = {
  component: Grid,
  title: 'composites/Grid',
};
export default Story;

export const Basic = {
  args: {
    container: true,
    spacing: 1,
    children: (
      <>
        <Grid item xs={8}>
          <Flex sx={{ backgroundColor: 'primary.main' }}>xs 8</Flex>
        </Grid>
        <Grid item xs={4}>
          <Flex sx={{ backgroundColor: 'secondary.main' }}>xs 4</Flex>
        </Grid>
        <Grid item xs={4}>
          <Flex sx={{ backgroundColor: 'red' }}>xs 4</Flex>
        </Grid>
        <Grid item xs={8}>
          <Flex sx={{ backgroundColor: 'blue' }}>xs 8</Flex>
        </Grid>
      </>
    ),
  },
};

//TODO: search results / responsive grid

export const Responsive = {
  args: {},
  render: (args) => {
    return (
      <Grid {...args} container spacing={2}>
        {posts?.map((post) => (
          <Grid key={post} item xs={12} sm={6} md={4} lg={3}>
            <Flex sx={{ backgroundColor: 'primary.main' }}>{post}</Flex>
          </Grid>
        ))}
      </Grid>
    );
  },
};
