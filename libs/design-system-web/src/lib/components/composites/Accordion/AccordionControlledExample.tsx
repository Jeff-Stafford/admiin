import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { Button } from '../../primatives/Button/Button';
import { Accordion } from './Accordion';
export const AccordionControlledExample = () => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <Box mb={1}>
          <Button
            fullWidth
            size="small"
            //label="Open Random Menu"
            onClick={() => {
              setExpandedIndex(Math.floor(Math.random() * (4 - 0 + 1) + 0));
            }}
          />
        </Box>
        <Box>
          <Accordion
            exclusive
            AccordionItemProps={{ showToggle: false }}
            expandedIndex={expandedIndex}
            items={[
              {
                icon: 'Briefcase',
                title: 'Lorem ipsum is placeholder text commonly',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
              },
              {
                icon: 'Briefcase',
                title: 'Adipiscing elit pellentesque habitant morbi tristique',
                body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
              },
              {
                icon: 'Briefcase',
                title: 'Adipiscing elit pellentesque habitant morbi tristique',
                body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
              },
              {
                icon: 'Briefcase',
                title: 'Adipiscing elit pellentesque habitant morbi tristique',
                body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
              },
              {
                icon: 'Briefcase',
                title: 'Adipiscing elit pellentesque habitant morbi tristique',
                body: 'Ac turpis egestas sed tempus urna et pharetra. Ac tortor vitae purus faucibus ornare suspendisse.',
              },
            ]}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
