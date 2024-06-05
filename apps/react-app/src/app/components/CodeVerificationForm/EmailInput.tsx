import { REGEX } from '@admiin-com/ds-common';
import { WBLink, WBTextField } from '@admiin-com/ds-web';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface EmailInputProps {
  disabled?: boolean;
  rightIcon?: React.ReactNode;
  fixed?: boolean;
}

export const EmailInput = ({
  disabled = false,
  rightIcon,
  fixed = false,
}: EmailInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const inputs = {
    email: {
      label: t('emailTitle', { ns: 'common' }),
      name: 'email' as const,
      type: 'email',
      placeholder: null,
      defaultValue: '',
      rules: {
        required: t('emailRequired', { ns: 'common' }),
        pattern: {
          value: REGEX.EMAIL,
          message: t('invalidEmail', { ns: 'common' }),
        },
      },
    },
  };
  return (
    <Controller
      control={control}
      name={`${fixed ? 'original_' : ''}${inputs.email.name}`}
      //@ts-ignore
      rules={inputs.email.rules}
      defaultValue={inputs.email.defaultValue}
      render={({ field: { ref, ...field } }) => (
        <WBTextField
          {...field}
          type={inputs.email.type}
          disabled={disabled}
          label={inputs.email.label}
          error={!!(errors.email && errors.email.message)}
          helperText={((errors.email && errors.email.message) as string) || ''}
          margin="dense"
          rightIcon={rightIcon}
        />
      )}
    />
  );
};
