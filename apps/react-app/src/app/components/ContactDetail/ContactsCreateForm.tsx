import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBTextField,
  WBTypography,
  useMediaQuery,
  WBTelInput,
  useSnackbar,
} from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Contact,
  ContactBankAccount,
  ContactBankAccountInput,
  ContactBpayInput,
  CreateContactInput,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
} from '@admiin-com/ds-graphql';
import { REGEX } from '@admiin-com/ds-common';
import { useTheme } from '@mui/material';
import { useCreateContact } from '../../hooks/useCreateContact/useCreateContact';
import { useUpdateContact } from '../../hooks/useUpdateContact/useUpdateContact';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { matchIsValidTel } from 'mui-tel-input';
import AbnAutoCompleteLookup from '../AutoCompleteLookup/AbnAutoCompleteLookup';
import ContactBankForm from '../ContactBankForm/ContactBankForm';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { WBLocationCompletion } from '@admiin-com/ds-amplify-web';
import { AddressResponse } from 'libs/amplify-web/src/lib/components/LocationAutoCompletion/LocationAutoCompletion';
export interface ContactCreateFormData {
  contactDetails: Contact & {
    address: string;
  };
  bankDetails: ContactBankAccount;
  bpay: ContactBpayInput;
}

interface ContactDetailFormProps {
  entityId?: string;
  selected?: Contact | null;
  onSubmitted?: (contact: Contact) => void;
}

export function ContactsCreateForm({
  selected = null,
  entityId: entityIdProps,
  onSubmitted,
}: ContactDetailFormProps) {
  const { t } = useTranslation();
  const methods = useForm<ContactCreateFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const [loading, setLoading] = useState(false);

  const [createContact, { error: createError }] = useCreateContact();
  const [updateContact, { error: updateError }] = useUpdateContact();

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));

  const entityId = entityIdProps ?? selectedEntityIdData?.selectedEntityId;

  useEffect(() => {
    if (!selected) {
      reset();
    }
  }, [reset, selected]);

  const inputs = React.useMemo(
    () => ({
      contactDetails: {
        firstName: {
          label: t('firstName', { ns: 'contacts' }),
          name: 'firstName' as const,
          type: 'text',
          placeholder: t('firstNamePlaceholder', { ns: 'contacts' }),
          defaultValue: selected?.firstName ?? '',
          rules: { required: t('firstNameRequired', { ns: 'contacts' }) },
        },
        lastName: {
          label: t('lastName', { ns: 'contacts' }),
          name: 'lastName' as const,
          type: 'text',
          placeholder: t('lastNamePlaceholder', { ns: 'contacts' }),
          defaultValue: selected?.lastName ?? '',
          rules: { required: t('lastNameRequired', { ns: 'contacts' }) },
        },
        email: {
          label: t('email', { ns: 'contacts' }),
          name: 'email' as const,
          type: 'email',
          defaultValue: selected?.email ?? '',
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
          type: selected?.phone ?? 'text',
          placeholder: t('phonePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {
            required: t('phoneRequired', { ns: 'common' }),
            validate: (value: string | null | undefined) =>
              value === null ||
              value === undefined ||
              value === '' ||
              matchIsValidTel(value) ||
              t('invalidPhone', { ns: 'common' }),
          },
        },
        companyName: {
          label: t('companyName', { ns: 'contacts' }),
          name: 'companyName' as const,
          type: selected?.companyName ?? 'text',
          placeholder: t('companyNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {},
        },
        address: {
          label: t('address', { ns: 'contacts' }),
          name: 'address' as const,
          type: 'text',
          placeholder: t('addressPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {
            pattern: {
              value: /.+/,
              message: t('addressPattern', { ns: 'contacts' }),
            },
          },
        },
      },
    }),
    [t, selected]
  );

  useEffect(() => {
    if (selected) {
      // setValue('contactDetails.address', selected.en)
      setValue('bankDetails.bankName', selected.bank?.bankName ?? '');
      setValue('bpay.billerCode', selected.bpay?.billerCode ?? '');
      setValue('bpay.referenceNumber', selected.bpay?.referenceNumber ?? '');

      setValue('contactDetails.companyName', selected.companyName ?? '');
      setValue('contactDetails.firstName', selected.firstName ?? '');
      setValue('contactDetails.lastName', selected.lastName ?? '');
      setValue('contactDetails.phone', selected.phone ?? '');
      setValue('contactDetails.email', selected.email ?? '');
      setValue('bankDetails.accountName', selected.bank?.accountName ?? '');
      setValue('bankDetails.accountNumber', selected.bank?.accountNumber ?? '');
      setValue('bankDetails.routingNumber', selected.bank?.routingNumber ?? '');
      if (selected.bank?.accountType)
        setValue('bankDetails.accountType', selected.bank?.accountType);
      if (selected.bank?.holderType)
        setValue('bankDetails.holderType', selected.bank?.holderType);
      console.log('selected', selected);
    }
  }, [selected, setValue]);
  const showSnackbar = useSnackbar();
  const onSubmit = async (data: ContactCreateFormData, event: any) => {
    event.stopPropagation();
    setLoading(true);
    try {
      const origialBank: ContactBankAccountInput | undefined | null =
        selected?.bank
          ? {
              ...selected.bank,
            }
          : undefined;
      const newBank: ContactBankAccountInput = {
        ...data.bankDetails,
      };
      const isBankDetailsEmpty =
        !data.bankDetails ||
        (data.bankDetails &&
          Object.values(data.bankDetails).every((value) => value === ''));
      const contact: CreateContactInput = {
        email: data.contactDetails.email ?? '',
        firstName: data.contactDetails.firstName ?? '',
        lastName: data.contactDetails.lastName ?? '',
        entityId,
        bpay: data.bpay,
      };
      if (!isDeepEqual(origialBank, newBank) && !isBankDetailsEmpty)
        contact.bank = { ...newBank };
      if (data.contactDetails.phone) contact.phone = data.contactDetails.phone;
      if (data.contactDetails.companyName && !selected) {
        contact.companyName = data.contactDetails.companyName;
        if (data.contactDetails.taxNumber) {
          contact.taxNumber = data.contactDetails.taxNumber;
        }
      }

      if (selected) {
        const updatedContact = await updateContact({
          variables: {
            input: {
              ...contact,
              id: selected.id,
            },
          },
        });
        onSubmitted && onSubmitted(updatedContact?.data.updateContact);
        showSnackbar({
          message: t('contactUpdated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      } else {
        const createdContact = await createContact({
          variables: {
            input: { ...contact },
          },
        });
        onSubmitted && onSubmitted(createdContact?.data.createContact);

        showSnackbar({
          message: t('contactCreated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      }

      setLoading(false);
    } catch (err) {
      console.log('error updating entity: ', err);
      setLoading(false);
    }
  };
  const theme = useTheme();

  const islg = useMediaQuery(theme.breakpoints.down('lg'));

  //@ts-ignore
  return (
    <WBFlex flexDirection="column" alignItems="center" mb={4}>
      <WBForm
        onSubmit={(e) => {
          e.stopPropagation(); // Prevent the event from bubbling up to the outer form
          handleSubmit(onSubmit)(e);
        }}
        alignSelf="stretch"
      >
        <WBTypography
          variant={islg ? 'h3' : 'h2'}
          noWrap
          component="div"
          color="dark"
          sx={{ flexGrow: 1, textAlign: 'left' }}
        >
          {t('contactsDetails', { ns: 'contacts' })}
        </WBTypography>
        <WBFlex flexDirection={['column', 'row']}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={`contactDetails.firstName`}
              rules={inputs.contactDetails.firstName.rules}
              defaultValue={inputs.contactDetails.firstName.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type="text"
                  variant="standard"
                  label={inputs.contactDetails.firstName.label}
                  placeholder={inputs.contactDetails.firstName.placeholder}
                  error={!!errors?.contactDetails?.firstName}
                  helperText={errors?.contactDetails?.firstName?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name={`contactDetails.lastName`}
              rules={inputs.contactDetails.lastName.rules}
              defaultValue={inputs.contactDetails.lastName.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type="text"
                  variant="standard"
                  label={inputs.contactDetails.lastName.label}
                  placeholder={inputs.contactDetails.lastName.placeholder}
                  error={!!errors?.contactDetails?.lastName}
                  helperText={errors?.contactDetails?.lastName?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
        </WBFlex>
        <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={`contactDetails.email`}
              rules={inputs.contactDetails.email.rules}
              defaultValue={inputs.contactDetails.email.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type="text"
                  variant="standard"
                  label={inputs.contactDetails.email.label}
                  placeholder={inputs.contactDetails.email.placeholder}
                  error={!!errors?.contactDetails?.email}
                  helperText={errors?.contactDetails?.email?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name="contactDetails.phone"
              defaultValue={inputs.contactDetails.phone.defaultValue}
              rules={inputs.contactDetails.phone.rules}
              render={({ field, fieldState }) => (
                //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
                <WBTelInput
                  {...field}
                  variant="standard"
                  helperText={
                    fieldState.invalid
                      ? t('invalidPhone', { ns: 'common' })
                      : ''
                  }
                  error={fieldState.invalid}
                  focusOnSelectCountry
                  defaultCountry="AU"
                  label={inputs.contactDetails.phone.label}
                  margin="dense"
                />
              )}
            />
          </WBBox>
        </WBFlex>
        <WBFlex mt={[0, 4]}>
          <Controller
            control={control}
            name={`contactDetails.companyName`}
            rules={inputs.contactDetails.companyName.rules}
            defaultValue={inputs.contactDetails.companyName.defaultValue}
            render={({ field }) => (
              <AbnAutoCompleteLookup
                {...field}
                label={inputs.contactDetails.companyName.label}
                placeholder={inputs.contactDetails.companyName.placeholder}
                noPopupIcon
                renderProps={{
                  error: !!errors?.contactDetails?.companyName,
                  helperText:
                    errors?.contactDetails?.companyName?.message || '',
                }}
                onFound={(result) => {
                  if (result.abn) {
                    setValue('contactDetails.taxNumber', result.abn);
                  }
                }}
                nameOnly
                disabled={!!selected}
              />
            )}
          />
        </WBFlex>
        {/* <WBFlex mt={[0, 4]}>
          <Controller
            control={control}
            name={`contactDetails.address`}
            rules={inputs.contactDetails.address.rules}
            defaultValue={inputs.contactDetails.address.defaultValue}
            render={({ field }) => (
              <WBLocationCompletion
                {...field}
                label={inputs.contactDetails.address.label}
                type={inputs.contactDetails.address.type}
                placeholder={inputs.contactDetails.address.placeholder}
                error={
                  !!(
                    errors?.contactDetails?.address &&
                    errors.contactDetails.address.message
                  )
                }
                helperText={
                  ((errors?.contactDetails?.address &&
                    errors.contactDetails.address.message) as string) || ''
                }
                onChange={(address: AddressResponse) => {
                  field.onChange(address.label);
                }}
                margin="dense"
              />
            )}
          />
        </WBFlex> */}

        <FormProvider {...methods}>
          <ContactBankForm />
        </FormProvider>
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 8,
            },
          }}
          loading={loading}
        >
          {t(`${selected ? 'updateContact' : 'createContact'}`, {
            ns: 'contacts',
          })}
        </WBButton>
      </WBForm>
      <ErrorHandler errorMessage={createError?.message} />
      <ErrorHandler errorMessage={updateError?.message} />
    </WBFlex>
  );
}
