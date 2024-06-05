import { WBLocationCompletion } from '@admiin-com/ds-amplify-web';
import { CreateEntityInput } from '@admiin-com/ds-graphql';
import styled from '@emotion/styled';
import { AddressResponse } from 'libs/amplify-web/src/lib/components/LocationAutoCompletion/LocationAutoCompletion';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStreetType } from '../../helpers/entities';

/* eslint-disable-next-line */
export interface EntityAddressFormProps {}

export function EntityAddressForm(props: EntityAddressFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<{ entity: CreateEntityInput }>();

  const { t } = useTranslation();

  const inputs = useMemo(
    () => ({
      address: {
        label: t('address', { ns: 'contacts' }),
        name: 'address' as const,
        type: 'text',
        placeholder: t('addressPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          required: t('addressRequired', { ns: 'contacts' }),
          pattern: {
            value: /.+/,
            message: t('addressPattern', { ns: 'contacts' }),
          },
        },
      },
    }),
    []
  );
  return (
    <Controller
      control={control}
      name={`entity.address.address1`}
      rules={inputs.address.rules}
      // defaultValue={''}
      render={({ field }) => (
        <WBLocationCompletion
          {...field}
          label={inputs.address.label}
          type={inputs.address.type}
          placeholder={inputs.address.placeholder}
          error={
            !!(
              errors?.entity?.address?.address1 &&
              errors.entity.address.address1.message
            )
          }
          helperText={
            ((errors?.entity?.address?.address1 &&
              errors.entity.address.address1.message) as string) || ''
          }
          onChange={(address: AddressResponse) => {
            field.onChange(address.label);
            setValue('entity.address.unitNumber', address.unitNumber);
            setValue('entity.address.postalCode', address.postalCode);
            setValue('entity.address.city', address.municipality);
            setValue('entity.address.state', address.region);
            setValue('entity.address.streetName', address.street || '');
            setValue(
              'entity.address.streetType',
              mapStreetType(address.street)
            );
            setValue('entity.address.streetNumber', address.addressNumber);
            setValue('entity.address.country', address.country);
          }}
          margin="dense"
        />
      )}
    />
  );
}

export default EntityAddressForm;
