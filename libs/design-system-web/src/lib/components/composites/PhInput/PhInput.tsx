import { MuiTelInputProps } from 'mui-tel-input';
import React, { forwardRef, Ref, useContext } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import { Icon } from '../../primatives/Icon/Icon';
import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';
import { InputError } from '../InputError/InputError';
import { TextField, TextFieldProps } from '../TextField/TextField';
import './styles.css';

interface PHInputProps extends TextFieldProps {
  value?: any;
  placeholder?: string;
  label?: string;
  defaultCountry: Country;
  withCountryCallingCode?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  name: string;
}

const PHoneInput = forwardRef(({ rightIcon, ...props }: any, ref: Ref<any>) => {
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
    <TextField
      {...props}
      inputRef={ref}
      InputProps={{
        sx: { padding: 0 },
        ...outlinedInputProps,
        ...props.InputProps,
      }}
    />
  );
});

//const PHoneSelect = ({ onChange, ...props }: any, ref: React.ForwardedRef<{ children?: ReactNode; }>) => {
//  return <Select
//    {...props}
//    fullWidth={false}
//    inputRef={ref}
//    onChange={e => onChange(e.target.value)}
//  />
//}

//const FPhoneSelect = forwardRef(PHoneSelect);

export const PhInput = ({
  value = '',
  placeholder = 'Enter mobile number',
  defaultCountry = 'AU',
  onChange = (e) => () => e,
  onFocus = (e) => () => e,
  onBlur = (e) => () => e,
  withCountryCallingCode = true,
  helperText = '',
  error = false,
  disabled = false,
  name = '',
  label = '',
}: PHInputProps) => {
  return (
    <>
      <PhoneInput
        value={value}
        name={name}
        placeholder={placeholder}
        label={label}
        disabled={disabled}
        //@ts-ignore
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        defaultCountry={defaultCountry}
        withCountryCallingCode={withCountryCallingCode}
        inputComponent={PHoneInput}
        //countrySelectComponent={FPhoneSelect}
      />
      {error && <InputError helperText={helperText} />}
    </>
  );
};
