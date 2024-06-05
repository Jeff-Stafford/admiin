import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { useMemo } from 'react';
import { Flex } from '../../primatives/Flex/Flex';
import { Typography } from '../../primatives/Typography/Typography';
import { Chip } from '../../primatives/Chip/Chip';

interface ChipListProps {
  tags: string[];
  numTags: number;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  variant?: 'outlined' | 'filled';
  sx?: SxProps<Theme>;
}

export const ChipList = ({
  tags,
  numTags,
  color,
  variant = 'outlined',
  sx,
}: ChipListProps) => {
  const slicedTags: string[] = useMemo(
    () => (tags?.length >= numTags ? tags.slice(0, numTags) : tags || []),
    [tags, numTags]
  );

  if (!tags?.length) {
    return <Flex alignItems="center" />;
  }

  const mappedTags = slicedTags.map((tag: string) => (
    <Chip
      key={tag}
      label={tag}
      variant={variant}
      color={color}
      sx={sx}
      //sx={{ mr: 1, mb: 1, ...sx }}
    />
  ));

  //TODO: placeholder color for typography
  if (tags.length > numTags) {
    return (
      <Flex alignItems="center">
        {mappedTags}
        <Typography color="placeholder">+ {tags.length - numTags}</Typography>
      </Flex>
    );
  }

  return <Flex alignItems="center">{mappedTags}</Flex>;
};
