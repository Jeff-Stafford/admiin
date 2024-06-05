import { CreateEntityInput, EntityType } from '@admiin-com/ds-graphql';
import { WBBox, WBSelect, WBStack, WBTextField } from '@admiin-com/ds-web';
import React, { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AbnAutoCompleteLookup from '../AutoCompleteLookup/AbnAutoCompleteLookup';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { CreateEntityForm } from '../ClientDetail/ClientsCreateForm';
import EntityAddressForm from '../EntityAddressForm/EntityAddressForm';

/* eslint-disable-next-line */
export interface EntityCreateFormProps {
  hasIndividual?: boolean;
}

export function EntityCreateForm({
  hasIndividual = false,
}: EntityCreateFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<{
    entity: CreateEntityForm;
  }>();
  const { t } = useTranslation();
  const entity = useWatch({ control, name: 'entity' });
  const isIndividual = entity?.type === EntityType.INDIVIDUAL;

  const [hasABN, setHasABN] = React.useState(false);

  const taxNumber = useWatch({ control, name: 'entity.taxNumber' });
  React.useEffect(() => {
    if (taxNumber && !hasABN) {
      setHasABN(true);
    }
  }, [taxNumber, hasABN]);

  const inputs = useMemo(
    () => ({
      entity: {
        type: {
          label: t('type', { ns: 'common' }),
          name: 'entity.type' as const,
          type: 'select',
          defaultValue: EntityType.COMPANY,
          rules: { required: t('typeRequired', { ns: 'onboarding' }) },
        },
        hasABN: {
          label1: t('hasABN', { ns: 'onboarding' }),
          label2: t('noABN', { ns: 'onboarding' }),
          name: 'entity.hasABN' as const,
          defaultValue: false,
        },
        taxNumber: {
          label: t('abn', { ns: 'onboarding' }),
          name: 'entity.taxNumber' as const,
          type: 'text',
          placeholder: t('abnPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: hasABN
            ? {
                required: t('abnRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        name: {
          label: t('businessName', { ns: 'onboarding' }),
          name: 'entity.name' as const,
          type: 'text',
          placeholder: t('businessNamePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: { required: t('businessNameRequired', { ns: 'onboarding' }) },
        },
        firstName: {
          label: t('firstNameTitle', { ns: 'common' }),
          name: 'entity.firstName' as const,
          type: 'text',
          placeholder: t('firstNamePlaceholder', { ns: 'common' }),
          defaultValue: '',
          rules: { required: t('firstNameRequired', { ns: 'common' }) },
        },
        lastName: {
          label: t('lastNameTitle', { ns: 'common' }),
          name: 'entity.lastName' as const,
          type: 'text',
          placeholder: t('lastNamePlaceholder', { ns: 'common' }),
          defaultValue: '',
          rules: { required: t('lastNameRequired', { ns: 'common' }) },
        },
      },
    }),
    [t, hasABN]
  );

  return (
    <>
      <Controller
        control={control}
        name={inputs.entity.type.name}
        rules={inputs.entity.type.rules}
        defaultValue={inputs.entity.type.defaultValue}
        render={({ field }) => (
          <WBBox>
            <WBSelect
              options={[
                ...Object.keys(EntityType)
                  .filter(
                    (type) =>
                      (hasIndividual && type !== EntityType.BPAY) ||
                      (!hasIndividual &&
                        type !== EntityType.INDIVIDUAL &&
                        type !== EntityType.BPAY)
                  )
                  .map((value) => ({
                    label: t(value, { ns: 'common' }),
                    value: value,
                  })),
              ]}
              label={inputs.entity.type.label}
              value={field.value}
              onChange={field.onChange}
              placeholder={inputs.entity.type.label}
            />
          </WBBox>
        )}
      />
      {isIndividual ? (
        <>
          {''}
          <Controller
            control={control}
            name={inputs.entity.firstName.name}
            rules={inputs.entity.firstName.rules}
            defaultValue={inputs.entity.firstName.defaultValue}
            render={({ field }) => (
              <WBBox sx={{ mt: 2 }}>
                <WBTextField
                  {...field}
                  label={inputs.entity.firstName.label}
                  type={inputs.entity.firstName.type}
                  placeholder={inputs.entity.firstName.placeholder}
                  error={
                    !!(
                      errors?.entity?.firstName &&
                      errors?.entity?.firstName.message
                    )
                  }
                  helperText={
                    ((errors?.entity?.firstName &&
                      errors?.entity?.firstName.message) as string) || ''
                  }
                  margin="dense"
                  // disabled={hasABN}
                />
              </WBBox>
            )}
          />
          <Controller
            control={control}
            name={inputs.entity.lastName.name}
            rules={inputs.entity.lastName.rules}
            defaultValue={inputs.entity.lastName.defaultValue}
            render={({ field }) => (
              <WBBox sx={{ mt: 2 }}>
                <WBTextField
                  {...field}
                  label={inputs.entity.lastName.label}
                  type={inputs.entity.lastName.type}
                  placeholder={inputs.entity.lastName.placeholder}
                  error={
                    !!(
                      errors?.entity?.lastName &&
                      errors?.entity?.lastName.message
                    )
                  }
                  helperText={
                    ((errors?.entity?.lastName &&
                      errors?.entity?.lastName.message) as string) || ''
                  }
                  margin="dense"
                  // disabled={hasABN}
                />
              </WBBox>
            )}
          />
        </>
      ) : (
        <>
          <WBStack sx={{ mt: 2 }} direction="row" spacing={2}>
            <ToggleButton
              onClick={() => setHasABN(true)}
              label={inputs.entity.hasABN.label1}
              isSelected={hasABN}
            />
            <ToggleButton
              onClick={() => setHasABN(false)}
              label={inputs.entity.hasABN.label2}
              isSelected={!hasABN}
            />
          </WBStack>
          {hasABN && (
            <Controller
              control={control}
              name={inputs.entity.taxNumber.name}
              rules={inputs.entity.taxNumber.rules}
              defaultValue={inputs.entity.taxNumber.defaultValue}
              render={({ field, fieldState }) => (
                <WBBox sx={{ mt: 2 }}>
                  {/* <WBTextField
                      {...field}
                      type={inputs.entity.taxNumber.type}
                      label={inputs.entity.taxNumber.label}
                      placeholder={inputs.entity.taxNumber.placeholder}
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      margin="dense"
                      rightIcon={
                        abnQueryLoading ? (
                          <CircularProgress size={'1rem'} />
                        ) : null
                      }
                    /> */}
                  <AbnAutoCompleteLookup
                    {...field}
                    label={inputs.entity.taxNumber.label}
                    placeholder={inputs.entity.taxNumber.placeholder}
                    noPopupIcon
                    onLoading={(loading: boolean) => {
                      // setABNLoading(loading);
                    }}
                    onFound={(value) => {
                      if (value) {
                        setValue('entity.name', value.name ?? '');
                        setValue('entity.taxNumber', value.abn);
                      } else {
                        setValue('entity.taxNumber', '');
                      }
                    }}
                    renderProps={{
                      error: fieldState.invalid,
                      helperText: fieldState.error?.message,
                    }}
                  />
                </WBBox>
              )}
            />
          )}
          {(!hasABN || (hasABN && entity?.name)) && (
            <Controller
              control={control}
              name={inputs.entity.name.name}
              rules={inputs.entity.name.rules}
              defaultValue={inputs.entity.name.defaultValue}
              render={({ field }) => (
                <WBBox sx={{ mt: 2 }}>
                  <WBTextField
                    {...field}
                    label={inputs.entity.name.label}
                    type={inputs.entity.name.type}
                    placeholder={inputs.entity.name.placeholder}
                    error={
                      !!(errors?.entity?.name && errors?.entity?.name.message)
                    }
                    helperText={
                      ((errors?.entity?.name &&
                        errors?.entity?.name.message) as string) || ''
                    }
                    margin="dense"
                    // disabled={hasABN}
                  />
                </WBBox>
              )}
            />
          )}
          <WBBox mt={2}>
            <EntityAddressForm />
          </WBBox>
        </>
      )}
    </>
  );
}

export default EntityCreateForm;
