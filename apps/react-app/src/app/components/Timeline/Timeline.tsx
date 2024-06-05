/* eslint-disable-next-line */

import {
  Timeline as MuiTimeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import React from 'react';
export interface TimelineProps {
  items: any[];
  render: (item: any) => React.ReactNode;
}
export function Timeline({ render, items }: TimelineProps) {
  return (
    <MuiTimeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {items?.map((item, index) => (
        <TimelineItem sx={{ minHeight: '55px' }} key={index}>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ bgcolor: 'white', borderWidth: 3 }}
            />
            {index !== items.length - 1 && index !== -1 ? (
              <TimelineConnector />
            ) : null}
          </TimelineSeparator>
          <TimelineContent mt={-1}>{render(item)}</TimelineContent>
        </TimelineItem>
      ))}
    </MuiTimeline>
  );
}

export default Timeline;
