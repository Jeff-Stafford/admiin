import { SxProps } from '@mui/system';
import React, { ForwardedRef, forwardRef } from 'react';
import {
  ButtonProps as MUIButtonProps,
  IconButton as MUIIconButton,
  IconButtonProps as MUIIconButtonProps,
  Theme,
} from '@mui/material';
import { Icon } from '../../primatives/Icon/Icon';

export interface IconButtonProps extends MUIIconButtonProps {
  library?: 'ioniconOutline' | 'ioniconSharp' | 'ioniconSolid';
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  iconSize?: any;
  onClick?: MUIIconButtonProps['onClick'];
  sx?: SxProps<Theme>;
  color?: MUIButtonProps['color'];
  to?: string;
}

export const IconButton = forwardRef(
  (
    {
      library,
      icon,
      iconSize,
      size = 'medium',
      onClick,
      color,
      sx,
      children,
      ...props
    }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <MUIIconButton
        size={size}
        sx={{
          ...sx,
          '&:disabled': {
            opacity: 0.2,
          },
        }}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {icon ? (
          <Icon
            library={library}
            name={icon}
            size={iconSize ?? size}
            color={color}
          />
        ) : (
          children
        )}
      </MUIIconButton>
    );
  }
);
