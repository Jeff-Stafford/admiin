import React, { FormEvent } from 'react';
import { BoxProps } from '@mui/material';
import { Flex } from '../Flex/Flex';

interface FormProps extends BoxProps {
  onSubmit: (e: FormEvent) => void;
}
export const Form = ({ ...props }: FormProps) => {
  return (
    <Flex component="form" flexDirection="column" mt={3} {...props}>
      {props.children}
    </Flex>
  );
};
