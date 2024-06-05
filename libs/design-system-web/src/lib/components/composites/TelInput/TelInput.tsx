import { Icon } from '../../primatives/Icon/Icon';
import { MuiTelInput, MuiTelInputProps } from 'mui-tel-input';
import React, { ReactNode, useContext } from 'react';
import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';

export type TelInputProps = MuiTelInputProps & {
  rightIcon?: string | ReactNode;
};
export type Ref = HTMLDivElement;
export const TelInput = React.forwardRef<Ref, TelInputProps>(
  ({ rightIcon, fullWidth = true, ...props }: TelInputProps, ref) => {
    let outlinedInputProps: MuiTelInputProps['InputProps'] = {};
    const { theme } = useContext(DesignSystemContext);

    const color:
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning' = 'secondary';

    if (typeof rightIcon !== 'undefined') {
      outlinedInputProps = {
        ...outlinedInputProps,
        endAdornment:
          typeof rightIcon === 'string' ? (
            <Icon
              name={rightIcon as string}
              color={theme.palette[color].main as string}
              size="large"
            />
          ) : (
            rightIcon
          ),
      };
    }

    return (
      <MuiTelInput
        ref={ref}
        {...props}
        fullWidth={fullWidth}
        defaultCountry="AU"
        forceCallingCode
        disableFormatting
        InputProps={{
          sx: { padding: 0 },
          ...outlinedInputProps,
          ...props.InputProps,
        }}
      />
    );
  }
);
