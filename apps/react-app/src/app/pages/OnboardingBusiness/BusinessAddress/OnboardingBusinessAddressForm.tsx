import { gql, useMutation } from '@apollo/client';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBLink,
  WBSelect,
  WBTextField,
} from '@admiin-com/ds-web';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Address, updateEntity as UPDATE_ENTITY } from '@admiin-com/ds-graphql';
import { WBLocationCompletion } from '@admiin-com/ds-amplify-web';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';
import { AddressResponse } from 'libs/amplify-web/src/lib/components/LocationAutoCompletion/LocationAutoCompletion';
import { STATES_AUSTRALIA } from '@admiin-com/ds-common';
import { mapStreetType } from '../../../helpers/entities';

type AddressForm = Address;

interface BusinessOnboardingFormData {
  isManual: boolean;
  address: AddressForm;
  addressText: string;
}

const OnboardingBusinessAddressForm = () => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BusinessOnboardingFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      isManual: false,
      addressText: '',
      address: {
        address1: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        // Add other fields as necessary
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const {
    onboardingEntity: entityData,
    nextBusiness,
    setOnboardingEntity,
    isDialog,
  } = useOnboardingProcess();

  const isManual = watch('isManual');
  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const inputs = useMemo(
    () => ({
      isManual: {
        label: t('enterAddressManually', { ns: 'onboarding' }),
        name: 'isManual' as const,
        defaultValue: false,
      },
      address: {
        label: t('businessAddress', { ns: 'onboarding' }),
        name: 'addressText' as const,
        type: 'text',
        placeholder: t('businessAddressPlaceholder', { ns: 'onboarding' }),
        defaultValue: '',
        rules: isManual
          ? {}
          : { required: t('businessAddressRequired', { ns: 'onboarding' }) },
      },
      manual: {
        unit_number: {
          label: t('unitNumber', { ns: 'onboarding' }),
          name: 'unitNumber' as const,
          type: 'text',
          placeholder: t('unitNumberPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {},
        },
        street_number: {
          label: t('streetNumber', { ns: 'onboarding' }),
          name: 'streetNumber' as const,
          type: 'text',
          placeholder: t('streetNumberPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {},
        },
        street_name: {
          label: t('streetName', { ns: 'onboarding' }),
          name: 'streetName' as const,
          type: 'text',
          placeholder: t('streetNamePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('streetNameRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        suburb: {
          label: t('suburb', { ns: 'onboarding' }),
          name: 'suburb' as const,
          type: 'text',
          placeholder: t('suburbPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('suburbRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        state: {
          label: t('state', { ns: 'onboarding' }),
          name: 'state' as const,
          type: 'text',
          placeholder: t('statePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('stateRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        country: {
          label: t('country', { ns: 'onboarding' }),
          name: 'country' as const,
          type: 'text',
          placeholder: t('countryPlaceholder', { ns: 'onboarding' }),
          defaultValue: 'AUS',
          rules: isManual
            ? {
                required: t('countryRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        postcode: {
          label: t('postcode', { ns: 'onboarding' }),
          name: 'postcode' as const,
          type: 'text',
          placeholder: t('postcodePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('postcodeRequired', { ns: 'onboarding' }),
              }
            : {},
        },
      },
    }),
    [t, isManual]
  );

  useEffect(() => {
    if (entityData && entityData.address) {
      // console.log(entityData.address);
      // const address1 = JSON.parse(entityData.address.address1);
      // const entityAddressText = [
      //   address1.unitNumber,
      //   `${address1.streetNumber ?? ''} ${address1.streetName ?? ''}`,
      //   entityData.address.postalCode,
      //   entityData.address.city,
      //   entityData.address.state,
      //   entityData.address.country,
      // ]
      //   .filter((e) => e !== '' && e !== null && e !== undefined)
      //   .join(', ');
      // console.log({ entityAddressText });
      // setValue(
      //   'addressText',
      //   entityData?.addressText ||
      //     (entityAddressText === ' '
      //       ? entityData?.addressText
      //       : entityAddressText),
      //   {
      //     shouldValidate: true,
      //   }
      // );
      setValue('addressText', entityData.address.address1);

      setValue('address.address1', entityData.address.address1);
      setValue('address.unitNumber', entityData.address.unitNumber);
      setValue('address.streetName', entityData.address.streetName);
      setValue('address.streetNumber', entityData.address.streetNumber);

      setValue('address.state', entityData.address.state);
      setValue('address.city', entityData.address.city);
      setValue('address.postalCode', entityData.address.postalCode);
      setValue('address.country', entityData.address.country);
    }
  }, [entityData, setValue]);
  const onSubmit = async (data: BusinessOnboardingFormData) => {
    setLoading(true);
    console.log(data);
    try {
      const address: Omit<Address, '__typename'> = {
        address1: data.addressText,
        unitNumber: data.address.unitNumber ?? '',
        streetName: data.address.streetName ?? '',
        streetNumber: data.address.streetNumber ?? '',
        city: data.address.city ?? '',
        streetType: data.address.streetType ?? '',
        country: data.address.country,
        state: data.address.state ?? '',
        postalCode: data.address.postalCode ?? '',
      };

      if (!isDialog) {
        const updateData = await updateEntity({
          variables: {
            input: {
              address: address,
              id: entityData.id,
            },
          },
        });
        setOnboardingEntity(updateData?.data.updateEntity);
      } else {
        setOnboardingEntity({
          ...entityData,
          address,
          addressText: watch('addressText'),
        });
      }

      setLoading(false);

      nextBusiness();
    } catch (err) {
      console.log('error updating entity: ', err);
      setLoading(false);
    }
  };

  return (
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '100%',
        sm: '80%',
        md: '60%',
        lg: '40%',
      }}
    >
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <>
          {''}
          <Controller
            control={control}
            name={inputs.address.name}
            rules={inputs.address.rules}
            defaultValue={inputs.address.defaultValue}
            render={({ field }) => (
              <WBBox>
                <WBLocationCompletion
                  {...field}
                  label={inputs.address.label}
                  type={inputs.address.type}
                  placeholder={inputs.address.placeholder}
                  error={!!(errors.addressText && errors.addressText.message)}
                  helperText={
                    ((errors.addressText &&
                      errors.addressText.message) as string) || ''
                  }
                  onChange={(address: AddressResponse) => {
                    field.onChange(address.label);
                    console.log({ address });
                    setValue('address.unitNumber', address.unitNumber);
                    setValue('address.postalCode', address.postalCode);
                    setValue('address.city', address.municipality);
                    setValue('address.state', address.region);
                    setValue('address.streetName', address.street);
                    setValue(
                      'address.streetType',
                      mapStreetType(address.street)
                    );
                    setValue('address.streetNumber', address.addressNumber);
                    setValue('address.country', address.country);
                  }}
                  onLocationLookupStart={() => setLoading(true)}
                  onLocationLookupEnd={() => setLoading(false)}
                  margin="dense"
                />
              </WBBox>
            )}
          />
          {!isManual && (
            <Controller
              control={control}
              name={inputs.isManual.name}
              defaultValue={inputs.isManual.defaultValue}
              render={({ field }) => (
                <WBLink
                  variant="body2"
                  mt={2}
                  underline="always"
                  onClick={() => field.onChange(true)}
                >
                  {inputs.isManual.label}
                </WBLink>
              )}
            />
          )}
        </>
        {isManual && (
          <>
            <WBFlex flexDirection={['column', 'row']}>
              <WBBox flex={1} pr={[0, 3]}>
                <Controller
                  control={control}
                  name={`address.unitNumber`}
                  rules={inputs.manual.unit_number.rules}
                  defaultValue={inputs.manual.unit_number.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      type="text"
                      label={inputs.manual.unit_number.label}
                      placeholder={inputs.manual.unit_number.placeholder}
                      error={!!errors?.address?.unitNumber}
                      helperText={errors?.address?.unitNumber?.message || ''}
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
              <WBBox flex={1} pr={[0, 3]}>
                <Controller
                  control={control}
                  name={`address.streetNumber`}
                  rules={inputs.manual.street_number.rules}
                  defaultValue={inputs.manual.street_number.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      label={inputs.manual.street_number.label}
                      type="text"
                      placeholder={inputs.manual.street_number.placeholder}
                      error={!!errors?.address?.streetNumber}
                      helperText={errors?.address?.streetNumber?.message || ''}
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
              <WBBox flex={3}>
                <Controller
                  control={control}
                  name={`address.streetName`}
                  rules={inputs.manual.street_name.rules}
                  defaultValue={inputs.manual.street_name.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      label={inputs.manual.street_name.label}
                      type="text"
                      placeholder={inputs.manual.street_name.placeholder}
                      error={!!errors?.address?.streetName}
                      helperText={errors?.address?.streetName?.message || ''}
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
            </WBFlex>

            <WBFlex mt={[0, 4]}>
              <Controller
                control={control}
                name={`address.city`}
                rules={inputs.manual.suburb.rules}
                defaultValue={inputs.manual.suburb.defaultValue}
                render={({ field }) => (
                  <WBTextField
                    {...field}
                    label={inputs.manual.suburb.label}
                    type="text"
                    placeholder={inputs.manual.suburb.placeholder}
                    error={!!errors?.address?.city}
                    helperText={errors?.address?.city?.message || ''}
                    margin="dense"
                  />
                )}
              />
            </WBFlex>
            <WBFlex flexDirection={['column', 'row']}>
              <Controller
                control={control}
                name={`address.state`}
                rules={inputs.manual.state.rules}
                defaultValue={inputs.manual.state.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1} pr={[0, 3]}>
                    {/* <WBTextField
                      {...field}
                      label={inputs.manual.state.label}
                      type="text"
                      placeholder={inputs.manual.state.placeholder}
                      error={!!errors?.address?.state}
                      helperText={errors?.address?.state?.message || ''}
                      margin="dense"
                    /> */}
                    <WBSelect
                      {...field}
                      label={inputs.manual.state.label}
                      error={!!errors?.address?.state}
                      helperText={errors?.address?.state?.message || ''}
                      margin="dense"
                      options={STATES_AUSTRALIA.map(
                        (state: { code: string; name: string }) => ({
                          label: state.name,
                          value: state.name,
                        })
                      )}
                    />
                  </WBBox>
                )}
              />

              <Controller
                control={control}
                name={`address.country`}
                rules={inputs.manual.country.rules}
                defaultValue={inputs.manual.country.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1} pr={[0, 3]}>
                    <WBTextField
                      {...field}
                      aria-readonly
                      value={'AUS'}
                      label={inputs.manual.country.label}
                      type="text"
                      placeholder={inputs.manual.country.placeholder}
                      error={!!errors?.address?.country}
                      helperText={errors?.address?.country?.message || ''}
                      margin="dense"
                    />
                  </WBBox>
                )}
              />
              <Controller
                control={control}
                name={`address.postalCode`}
                rules={inputs.manual.postcode.rules}
                defaultValue={inputs.manual.postcode.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1}>
                    <WBTextField
                      {...field}
                      label={inputs.manual.postcode.label}
                      type="text"
                      placeholder={inputs.manual.postcode.placeholder}
                      error={!!errors?.address?.postalCode}
                      helperText={errors?.address?.postalCode?.message || ''}
                      margin="dense"
                    />
                  </WBBox>
                )}
              />
            </WBFlex>
          </>
        )}
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          disabled={loading}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      {updateError?.message && (
        <WBAlert title={updateError.message} severity="error" sx={{ my: 2 }} />
      )}
    </WBFlex>
  );
};

export default OnboardingBusinessAddressForm;
