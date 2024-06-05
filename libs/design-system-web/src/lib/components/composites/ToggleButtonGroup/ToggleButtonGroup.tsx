import {
  InputLabel,
  ToggleButtonGroup as MUIToggleButtonGroup,
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
} from '@mui/material';
import React from 'react';
import { WBTypography } from '../..';
import InformationIcon from '../../primatives/InformationIcon/InformationIcon';

interface ToggleButtonGroupProps extends MuiToggleButtonGroupProps {
  label?: string;
  rightLabel?: string;
  infoTooltip?: string;
}
export type Ref = HTMLDivElement;

export const ToggleButtonGroup = React.forwardRef<Ref, ToggleButtonGroupProps>(
  ({ label, rightLabel, infoTooltip, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <>
        {label ? (
          <InputLabel
            focused={isFocused}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <WBTypography component={'div'} variant="inherit" color={'inherit'}>
              {label} <InformationIcon title={infoTooltip} />
            </WBTypography>
            <WBTypography
              component={'span'}
              variant="body2"
              fontStyle={'italic'}
              color={'text.secondary'}
            >
              {rightLabel}
            </WBTypography>
          </InputLabel>
        ) : null}
        {/* {rightLabel ? (
          <InputLabel sx={{ right: 0 }}>{rightLabel}</InputLabel>
        ) : null} */}
        <MUIToggleButtonGroup
          {...props}
          ref={ref}
          sx={{
            ...props.sx,
            marginTop: label ? 4 : 0,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </>
    );
  }
);
