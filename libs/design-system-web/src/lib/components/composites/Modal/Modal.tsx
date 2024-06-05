import { Modal as MUIModal, ModalProps as MUIModalProps } from '@mui/material';
import React from 'react';
import { Box } from '../../primatives/Box/Box';
import { Flex } from '../../primatives/Flex/Flex';
import { Typography } from '../../primatives/Typography/Typography';
import { IconButton } from '../IconButton/IconButton';

interface ModalProps extends MUIModalProps {
  title?: string;
}

export const Modal = ({ open, onClose, title, sx, children }: ModalProps) => {
  return (
    <MUIModal
      open={open}
      onClose={onClose}
      aria-labelledby={title}
      //aria-describedby="modal-modal-description"
    >
      <Box
        p={[2, 3, 4]}
        sx={{
          position: 'absolute',
          minWidth: 360,
          inset: 20,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 'medium',
          overflowY: 'auto',
          ...sx,
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h3" m={0}>
            {title || ''}
          </Typography>
          {onClose && (
            <IconButton
              icon="Close"
              onClick={(e) => onClose(e, 'backdropClick')}
            />
          )}
        </Flex>

        <Flex flexDirection="column">{children}</Flex>
      </Box>
    </MUIModal>
  );
};
