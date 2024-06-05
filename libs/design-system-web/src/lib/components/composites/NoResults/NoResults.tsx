import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { Button } from '../../primatives/Button/Button';
import { Flex } from '../../primatives/Flex/Flex';
import { Typography } from '../../primatives/Typography/Typography';

interface NoResultsProps {
  title?: string;
  description?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  btnTitle?: string;
  sx?: SxProps<Theme>;
}

export const NoResults = ({
  title,
  description,
  btnTitle,
  sx,
  onClick,
}: NoResultsProps) => {
  return (
    <Flex flexDirection="column" p={4} sx={sx}>
      {title && (
        <Typography textAlign="center" variant="h4">
          {title}
        </Typography>
      )}
      {description && <Typography textAlign="center">{description}</Typography>}
      {onClick && (
        <Button
          variant="outlined"
          sx={{
            alignSelf: 'center',
            mt: 3,
          }}
          onClick={onClick}
        >
          {btnTitle}
        </Button>
      )}
    </Flex>
  );
};
