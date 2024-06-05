import { REGEX } from '@admiin-com/ds-common';
import {
  WBBox,
  WBFlex,
  WBTelInput,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { matchIsValidTel } from 'mui-tel-input';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ClientInput } from '@admiin-com/ds-graphql';
import { Auth } from 'aws-amplify';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';

/* eslint-disable-next-line */
export interface ContactFormProps {
  disabled?: boolean;
}

export function ContactForm({ disabled = false }: ContactFormProps) {
  const { t } = useTranslation();
  const inputs = React.useMemo(
    () => ({
      client: {
        firstName: {
          label: t('firstName', { ns: 'contacts' }),
          name: 'firstName' as const,
          type: 'text',
          placeholder: t('firstNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: { required: t('firstNameRequired', { ns: 'contacts' }) },
        },
        lastName: {
          label: t('lastName', { ns: 'contacts' }),
          name: 'lastName' as const,
          type: 'text',
          placeholder: t('lastNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: { required: t('lastNameRequired', { ns: 'contacts' }) },
        },
        email: {
          label: t('email', { ns: 'contacts' }),
          name: 'email' as const,
          type: 'email',
          defaultValue: '',
          placeholder: t('emailPlaceholder', { ns: 'contacts' }),
          rules: {
            required: t('emailRequired', { ns: 'common' }),
            pattern: {
              value: REGEX.EMAIL,
              message: t('invalidEmail', { ns: 'common' }),
            },
          },
        },
        phone: {
          label: t('phone', { ns: 'contacts' }),
          name: 'phone' as const,
          type: 'text',
          placeholder: t('phonePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {
            // required: t('phoneRequired', { ns: 'common' }),
            validate: (value: string | null | undefined) =>
              value === null ||
              value === undefined ||
              value === '' ||
              matchIsValidTel(value) ||
              t('invalidPhone', { ns: 'common' }),
          },
        },
      },
    }),
    [t]
  );

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<{
    client: ClientInput;
  }>();

  return (
    <>
      <WBFlex flexDirection={['column', 'row']}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`client.firstName`}
            rules={inputs.client.firstName.rules}
            defaultValue={inputs.client.firstName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.client.firstName.label}
                placeholder={inputs.client.firstName.placeholder}
                error={!!errors?.client?.firstName}
                helperText={errors?.client?.firstName?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name={`client.lastName`}
            rules={inputs.client.lastName.rules}
            defaultValue={inputs.client.lastName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.client.lastName.label}
                placeholder={inputs.client.lastName.placeholder}
                error={!!errors?.client?.lastName}
                helperText={errors?.client?.lastName?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
      </WBFlex>
      <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`client.email`}
            rules={inputs.client.email.rules}
            defaultValue={inputs.client.email.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.client.email.label}
                placeholder={inputs.client.email.placeholder}
                error={!!errors?.client?.email}
                helperText={errors?.client?.email?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name="client.phone"
            defaultValue={inputs.client.phone.defaultValue}
            rules={inputs.client.phone.rules}
            render={({ field, fieldState }) => (
              //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
              <WBTelInput
                {...field}
                variant="standard"
                helperText={
                  fieldState.invalid ? t('invalidPhone', { ns: 'common' }) : ''
                }
                error={fieldState.invalid}
                focusOnSelectCountry
                defaultCountry="AU"
                label={inputs.client.phone.label}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
      </WBFlex>
    </>
  );
}

export default ContactForm;
