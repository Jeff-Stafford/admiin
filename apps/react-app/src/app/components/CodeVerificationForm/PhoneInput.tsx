import { WBTelInput } from '@admiin-com/ds-web';
import { matchIsValidTel } from 'mui-tel-input';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface PhoneInputProps {
  disabled?: boolean;
  fixed?: boolean;
  rightIcon?: React.ReactNode;
}

export const PhoneInput = ({
  disabled = false,
  fixed = false,
  rightIcon,
}: PhoneInputProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const inputs = {
    phone: {
      label: t('phone', { ns: 'contacts' }),
      name: 'phone' as const,
      type: 'text',
      placeholder: t('phonePlaceholder', { ns: 'contacts' }),
      defaultValue: '',
      rules: {
        validate: (value: string | null | undefined) =>
          value === null ||
          value === undefined ||
          value === '' ||
          matchIsValidTel(value) ||
          t('invalidPhone', { ns: 'common' }),
      },
    },
  };
  return (
    <Controller
      control={control}
      name={`${fixed ? 'original_' : ''}${inputs.phone.name}`}
      //@ts-ignore
      rules={inputs.phone.rules}
      defaultValue={inputs.phone.defaultValue}
      render={({ field, fieldState }) => (
        //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
        <WBTelInput
          {...field}
          variant="standard"
          helperText={
            fieldState.invalid ? t('invalidPhone', { ns: 'common' }) : ''
          }
          error={fieldState.invalid}
          defaultCountry="AU"
          label={inputs.phone.label}
          margin="dense"
          forceCallingCode
          disableFormatting
          disabled={disabled}
          rightIcon={rightIcon}
        />
      )}
    />
  );
};
