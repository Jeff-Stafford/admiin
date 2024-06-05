import React, { ReactNode } from 'react';
import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { useContext } from 'react';
import { Icon } from '../../primatives/Icon/Icon';

import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';
import { WBBox } from '../..';
import InformationIcon from '../../primatives/InformationIcon/InformationIcon';

export interface TextFieldProps extends Omit<MUITextFieldProps, 'variant'> {
  rightIcon?: string | ReactNode;
  leftIcon?: string | ReactNode;
  success?: boolean;
  error?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: string | number;
  maxRows?: string | number;
  variant?: TextFieldVariants;
  rightLabel?: React.ReactNode;
  placeholder?: string;
  infoToolTip?: string;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      success = false,
      error = false,
      type = 'text',
      helperText,
      rightIcon,
      rightLabel,
      leftIcon,
      fullWidth = true,
      multiline = false,
      variant = 'standard',
      rows = 0,
      maxRows = 0,
      placeholder = '',
      inputRef,
      infoToolTip,
      ...props
    }: TextFieldProps,
    ref
  ) => {
    const { theme } = useContext(DesignSystemContext);
    let outlinedInputProps: MUITextFieldProps['InputProps'] = {};

    let color:
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning' = 'secondary';

    if (error) {
      color = 'error';
    }

    if (success) {
      color = 'success';
    }
    const hasInfoIcon = infoToolTip ? true : false;

    if (helperText && !rightIcon && error) {
      rightIcon = 'CloseCircle';
    }

    if (typeof rightIcon !== 'undefined') {
      outlinedInputProps = {
        ...outlinedInputProps,
        endAdornment:
          typeof rightIcon === 'string' ? (
            <Icon
              name={rightIcon as string}
              color={theme.palette[color].main as string}
              size="medium"
            />
          ) : (
            <>
              {rightIcon}
              {props.InputProps?.endAdornment}
            </>
          ),
      };
    }
    if (typeof leftIcon !== 'undefined') {
      outlinedInputProps = {
        ...outlinedInputProps,
        startAdornment:
          typeof leftIcon === 'string' ? (
            <WBBox mr={2}>
              <Icon
                name={leftIcon as string}
                color={theme.palette.common.white}
                size="small"
              />
            </WBBox>
          ) : (
            leftIcon
          ),
      };
    }
    return (
      <MUITextField
        ref={ref}
        inputRef={inputRef}
        type={type}
        color={color}
        variant={variant}
        helperText={helperText}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        placeholder={placeholder}
        FormHelperTextProps={{
          sx: {
            marginY: 0,
            color:
              theme.palette[color === 'secondary' ? 'primary' : color].main,
          },
          variant,
        }}
        {...props}
        InputProps={{
          placeholder: placeholder,
          sx: { padding: 0 },
          ...props.InputProps,
          ...outlinedInputProps,
        }}
        InputLabelProps={{
          sx: {
            // lineHeight: '40px',
            // marginY: 1,
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          component: 'div',
          shrink: false,
        }}
        label={
          props.label ? (
            <>
              <WBBox width="100%">
                {props.label}&nbsp;
                <InformationIcon title={infoToolTip} />
              </WBBox>
              <WBBox>{rightLabel}</WBBox>
            </>
          ) : null
        }
        fullWidth={fullWidth}
      />
    );
  }
);
