import { gql, useMutation } from '@apollo/client';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBLink,
  WBSelect,
  WBStack,
  WBTextField,
} from '@admiin-com/ds-web';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  EntityType,
  updateEntity as UPDATE_ENTITY,
} from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { ToggleButton } from '../../../components/ToggleButton/ToggleButton';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';
import AbnAutoCompleteLookup from '../../../components/AutoCompleteLookup/AbnAutoCompleteLookup';

interface BusinessOnboardingFormData {
  type: EntityType | '';
  taxNumber: string;
  hasABN: boolean;
  name: string;
  firstName?: string;
  lastName?: string;
}

const OnboardingBusinessCreateForm = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm<BusinessOnboardingFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      hasABN: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const {
    onboardingEntity: entityData,
    finishOnboarding,
    setOnboardingEntity,
    nextBusiness,
    createEntityError,
    onFinal,
    createEntityFromOnboarding,
    user,
    isDialog,
  } = useOnboardingProcess();

  const { hasABN } = watch();

  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const inputs = useMemo(
    () => ({
      type: {
        label: t('type', { ns: 'common' }),
        name: 'type' as const,
        type: 'select',
        defaultValue: '',
        rules: { required: t('typeRequired', { ns: 'onboarding' }) },
      },
      hasABN: {
        label1: t('hasABN', { ns: 'onboarding' }),
        label2: t('noABN', { ns: 'onboarding' }),
        name: 'hasABN' as const,
        defaultValue: false,
      },
      taxNumber: {
        label: t('abn', { ns: 'onboarding' }),
        name: 'taxNumber' as const,
        type: 'text',
        placeholder: t('abnPlaceholder', { ns: 'onboarding' }),
        defaultValue: '',
        rules: hasABN
          ? {
              required: t('abnRequired', { ns: 'onboarding' }),
              // minLength: {
              //   value: ACN_LENGTH,
              //   message: `ABN must be ${ACN_LENGTH} digits long`, // Custom message for minLength
              // },
              // maxLength: {
              //   value: ABN_LENGTH,
              //   message: `ABN must be ${ABN_LENGTH} digits long`, // Custom message for maxLength
              // },
              // pattern: {
              //   value: /^\d{11}$/, // Regex for exactly 11 digits
              //   message: 'Invalid ABN format', // Custom message for pattern
              // },
            }
          : {},
      },
      name: {
        label: t('businessName', { ns: 'onboarding' }),
        name: 'name' as const,
        type: 'text',
        placeholder: t('businessNamePlaceholder', { ns: 'onboarding' }),
        defaultValue: '',
        rules: { required: t('businessNameRequired', { ns: 'onboarding' }) },
      },
      firstName: {
        label: t('firstNameTitle', { ns: 'common' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('firstNamePlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: { required: t('firstNameRequired', { ns: 'common' }) },
      },
      lastName: {
        label: t('lastNameTitle', { ns: 'common' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: { required: t('lastNameRequired', { ns: 'common' }) },
      },
    }),
    [t, hasABN]
  );

  useEffect(() => {
    if (entityData) {
      if (entityData.type)
        setValue('type', entityData.type, { shouldValidate: true });
      if (entityData.taxNumber) {
        setValue('taxNumber', entityData.taxNumber, { shouldValidate: true });
        setValue('hasABN', true, { shouldValidate: true });
      }

      if (entityData.name)
        setValue('name', entityData.name, { shouldValidate: true });
    }
    if (user.firstName && !watch('firstName') && !isDialog) {
      setValue('firstName', user.firstName, { shouldValidate: true });
    }
    if (user.lastName && !watch('lastName') && !isDialog) {
      setValue('lastName', user.lastName, { shouldValidate: true });
    }
  }, [entityData, setValue, user.firstName, user.lastName]);

  // useEffect(() => {
  //   if (abnLookupFailed) {
  //     setError('taxNumber', {
  //       type: 'manual',
  //       message: t('invalidABN', { ns: 'onboarding' }),
  //     });
  //   }
  // }, [abnLookupFailed, setError, t]);
  const [abnLoading, setABNLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: BusinessOnboardingFormData) => {
    // if (hasABN && (abnLookupFailed )) {
    //   setError('taxNumber', {
    //     type: 'manual',
    //     message: t('invalidABN', { ns: 'onboarding' }),
    //   });
    //   return;
    // }
    if (abnLoading) {
      setError('taxNumber', {
        type: 'manual',
        message: t('abnLoading', { ns: 'onboarding' }),
      });
      return;
    }

    setLoading(true);
    try {
      let updatedData;
      const input: any = {
        type: data.type,
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      if (data.type === EntityType.INDIVIDUAL) {
        input.name = `${data.firstName} ${data.lastName}`;
      }
      if (data.hasABN && data.taxNumber) input.taxNumber = data.taxNumber;
      if (!entityData?.id && !isDialog) {
        await createEntityFromOnboarding(input);
      } else {
        if (!isDialog) {
          updatedData = await updateEntity({
            variables: { input: { ...input, id: entityData.id } },
          });
          setOnboardingEntity(updatedData?.data.updateEntity);
        } else {
          setOnboardingEntity({ ...(entityData ?? {}), ...input });
        }
      }
      setLoading(false);
      nextBusiness();
    } catch (err) {
      console.log(
        `error ${entityData?.id ? 'updating' : 'create'} entity: `,
        err
      );
      setLoading(false);
    }
  };
  const isIndividual = watch('type') === EntityType.INDIVIDUAL;

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
        <Controller
          control={control}
          name={inputs.type.name}
          rules={inputs.type.rules}
          defaultValue={inputs.type.defaultValue as ''}
          render={({ field }) => (
            <WBBox>
              <WBSelect
                options={[
                  ...Object.keys(EntityType)
                    .filter(
                      (type) =>
                        (isDialog && type !== EntityType.BPAY) ||
                        (!isDialog &&
                          type !== EntityType.INDIVIDUAL &&
                          type !== EntityType.BPAY)
                    )
                    .map((value) => ({
                      label: t(value, { ns: 'common' }),
                      value: value,
                    })),
                ]}
                label={inputs.type.label}
                value={field.value}
                onChange={field.onChange}
                placeholder={inputs.type.label}
                error={!!(errors.type && errors.type.message)} // Add error handling
                helperText={(errors.type && errors.type.message) || ''} // Add helper text for errors
              />
            </WBBox>
          )}
        />
        {isIndividual ? (
          <>
            {''}
            <Controller
              control={control}
              name={inputs.firstName.name}
              rules={inputs.firstName.rules}
              defaultValue={inputs.firstName.defaultValue}
              render={({ field }) => (
                <WBBox sx={{ mt: 2 }}>
                  <WBTextField
                    {...field}
                    label={inputs.firstName.label}
                    type={inputs.firstName.type}
                    placeholder={inputs.firstName.placeholder}
                    error={!!(errors.firstName && errors.firstName.message)}
                    helperText={
                      ((errors.firstName &&
                        errors.firstName.message) as string) || ''
                    }
                    margin="dense"
                    // disabled={hasABN}
                  />
                </WBBox>
              )}
            />
            <Controller
              control={control}
              name={inputs.lastName.name}
              rules={inputs.lastName.rules}
              defaultValue={inputs.lastName.defaultValue}
              render={({ field }) => (
                <WBBox sx={{ mt: 2 }}>
                  <WBTextField
                    {...field}
                    label={inputs.lastName.label}
                    type={inputs.lastName.type}
                    placeholder={inputs.lastName.placeholder}
                    error={!!(errors.lastName && errors.lastName.message)}
                    helperText={
                      ((errors.lastName &&
                        errors.lastName.message) as string) || ''
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
            <Controller
              control={control}
              name={inputs.hasABN.name}
              defaultValue={inputs.hasABN.defaultValue}
              render={({ field }) => (
                <WBStack sx={{ mt: 2 }} direction="row" spacing={2}>
                  <ToggleButton
                    onClick={() => field.onChange(true)}
                    label={inputs.hasABN.label1}
                    isSelected={field.value}
                  />
                  <ToggleButton
                    onClick={() => field.onChange(false)}
                    label={inputs.hasABN.label2}
                    isSelected={!field.value}
                  />
                </WBStack>
              )}
            />
            {hasABN && (
              <Controller
                control={control}
                name={inputs.taxNumber.name}
                rules={inputs.taxNumber.rules}
                defaultValue={inputs.taxNumber.defaultValue}
                render={({ field, fieldState }) => (
                  <WBBox sx={{ mt: 2 }}>
                    {/* <WBTextField
                      {...field}
                      type={inputs.taxNumber.type}
                      label={inputs.taxNumber.label}
                      placeholder={inputs.taxNumber.placeholder}
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
                      label={inputs.taxNumber.label}
                      placeholder={inputs.taxNumber.placeholder}
                      noPopupIcon
                      onLoading={(loading: boolean) => {
                        setABNLoading(loading);
                      }}
                      onFound={(value) => {
                        if (value)
                          setOnboardingEntity({
                            ...entityData,
                            taxNumber: value.abn,
                            name: value.name,
                          });
                        else {
                          setOnboardingEntity({
                            ...entityData,
                            taxNumber: '',
                          });
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
            {(!hasABN || (hasABN && entityData?.name)) && (
              <Controller
                control={control}
                name={inputs.name.name}
                rules={inputs.name.rules}
                defaultValue={inputs.name.defaultValue}
                render={({ field }) => (
                  <WBBox sx={{ mt: 2 }}>
                    <WBTextField
                      {...field}
                      label={inputs.name.label}
                      type={inputs.name.type}
                      placeholder={inputs.name.placeholder}
                      error={!!(errors.name && errors.name.message)}
                      helperText={
                        ((errors.name && errors.name.message) as string) || ''
                      }
                      margin="dense"
                      // disabled={hasABN}
                    />
                  </WBBox>
                )}
              />
            )}
          </>
        )}
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          // disabled={abnQueryLoading}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      <WBLink
        variant="body2"
        sx={{ mt: 5 }}
        underline="always"
        color={theme.palette.text.primary}
        onClick={() => {
          if (isDialog && onFinal) onFinal();
          else finishOnboarding();
        }}
      >
        {t('doThisLater', { ns: 'common' })}
      </WBLink>
      {!isDialog && (createEntityError?.message || updateError?.message) && (
        <WBAlert
          title={createEntityError?.message ?? updateError?.message}
          severity="error"
          sx={{ my: 2 }}
        />
      )}
    </WBFlex>
  );
};

export default OnboardingBusinessCreateForm;
