import React, { ForwardedRef } from 'react';
import { ButtonProps as MUIButtonProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export interface ButtonProps extends MUIButtonProps {
  style?: React.CSSProperties;
  size?: MUIButtonProps['size'];
  color?: MUIButtonProps['color'];
  disabled?: MUIButtonProps['disabled'];
  fullWidth?: MUIButtonProps['fullWidth'];
  startIcon?: MUIButtonProps['startIcon'];
  variant?: MUIButtonProps['variant'];
  loading?: boolean;
  uppercase?: boolean;
  children?: React.ReactNode;
  textColor?: string;
  href?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button = React.forwardRef(
  (
    {
      variant = 'contained',
      type = 'submit',
      ...props
    }: //color = 'primary',
    //disabled = false,
    //fullWidth = false,

    //loading = false,
    //size = 'medium',
    //style = {},
    //href,
    //to,
    //onClick = (e) => e,
    //startIcon = null,
    //type = 'submit',
    //children,
    //sx = {},
    ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <LoadingButton type={type} variant={variant} {...props} ref={ref} />;
  }
);

/*
import React from 'react';
import { ButtonProps as MUIButtonProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export interface ButtonProps extends MUIButtonProps {
  style?: React.CSSProperties;
  size?: MUIButtonProps['size'];
  color?: MUIButtonProps['color'];
  disabled?: MUIButtonProps['disabled'];
  fullWidth?: MUIButtonProps['fullWidth'];
  startIcon?: MUIButtonProps['startIcon'];
  variant?: MUIButtonProps['variant'];
  loading?: boolean;
  uppercase?: boolean;
  children?: React.ReactNode;
  textColor?: string;
  href?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button = ({
  color = 'primary',
  disabled = false,
  fullWidth = false,
  variant = 'contained',
  loading = false,
  size = 'medium',
  style = {},
  href,
  to,
  onClick = (e) => e,
  startIcon = null,
  type = 'submit',
  children,
  sx = {},
}: ButtonProps) => {
  let defaultProps: MUIButtonProps = {
    color,
    disabled,
    disableElevation: true,
    fullWidth,
    variant,
    size,
    style,
    type,
    sx,
  };

  if (href) {
    defaultProps = { ...defaultProps, href };
  }

  return (
    <LoadingButton
      {...defaultProps}
      startIcon={startIcon}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </LoadingButton>
  );
};
*/
