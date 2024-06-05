import {
  WBBox,
  WBFlex,
  WBSelect,
  WBTextField,
  WBTypography,
  useMediaQuery,
  useTheme,
} from '@admiin-com/ds-web';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContactCreateFormData } from '../ContactDetail/ContactsCreateForm';
import React from 'react';
import { BankAccountType, BankHolderType } from '@admiin-com/ds-graphql';

/* eslint-disable-next-line */
export interface ContactBankFormProps {}

export function ContactBankForm(props: ContactBankFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const {
    control,
    formState: { errors },
  } = useFormContext<ContactCreateFormData>();

  const bankDetails = useWatch({
    control,
    name: 'bankDetails',
  });
  const isBankDetailsEmpty =
    !bankDetails ||
    (bankDetails &&
      Object.entries(bankDetails).every(([key, value]) => {
        return (
          key === 'accountType' ||
          key === 'holderType' ||
          (key !== 'accountType' && key !== 'holderType' && value === '')
        );
      }));
  // Object.values(bankDetails).every((value) => value === ''));

  const inputs = React.useMemo(
    () => ({
      bankDetails: {
        bankName: {
          label: t('bankName', { ns: 'contacts' }),
          name: 'bankName' as const,
          type: 'text',
          placeholder: t('bankNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isBankDetailsEmpty
            ? {
                required: t('bankNameRequired', { ns: 'contacts' }),
                minLength: {
                  value: 3,
                  message: t('bankNameMinLength', { ns: 'contacts' }),
                },
                maxLength: {
                  value: 50,
                  message: t('bankNameMaxLength', { ns: 'contacts' }),
                },
              }
            : {},
        },
        accountName: {
          label: t('accountName', { ns: 'contacts' }),
          name: 'accountName' as const,
          type: 'text',
          placeholder: t('accountNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isBankDetailsEmpty
            ? {
                required: t('accountNameRequired', { ns: 'contacts' }),
                minLength: {
                  value: 3,
                  message: t('accountNameMinLength', { ns: 'contacts' }),
                },
                maxLength: {
                  value: 50,
                  message: t('accountNameMaxLength', { ns: 'contacts' }),
                },
              }
            : {},
        },
        routingNumber: {
          label: t('bsb', { ns: 'contacts' }),
          name: 'bsb' as const,
          type: 'text',
          placeholder: t('bsbPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isBankDetailsEmpty
            ? {
                required: t('bsbRequired', { ns: 'contacts' }),
                pattern: {
                  value: /^\d{6}$/,
                  message: t('bsbPattern', { ns: 'contacts' }),
                },
              }
            : {},
        },
        accountNumber: {
          label: t('accountNumber', { ns: 'contacts' }),
          name: 'accountNumber' as const,
          type: 'text',
          placeholder: t('accountNumberPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isBankDetailsEmpty
            ? {
                required: t('accountNumberRequired', { ns: 'contacts' }),
                minLength: {
                  value: 8,
                  message: t('accountNumberMinLength', {
                    ns: 'contacts',
                    count: 8,
                  }),
                },
                maxLength: {
                  value: 12,
                  message: t('accountNumberMaxLength', {
                    ns: 'contacts',
                    count: 12,
                  }),
                },
              }
            : {},
        },
      },
      bpay: {
        billerCode: {
          label: t('billerCode', { ns: 'contacts' }),
          name: 'bpay.billerCode' as const,
          type: 'text',
          placeholder: t('billerCodePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {},
        },
        referenceNumber: {
          label: t('referenceNumber', { ns: 'contacts' }),
          name: 'bpay.referenceNumber' as const,
          type: 'text',
          placeholder: t('referenceNumberPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {},
        },
      },
    }),
    [isBankDetailsEmpty]
  );
  return (
    <WBBox mt={5}>
      <WBTypography
        variant={islg ? 'h3' : 'h2'}
        noWrap
        component="div"
        color="dark"
        sx={{ flexGrow: 1, textAlign: 'left' }}
      >
        {t('bankDetails', { ns: 'contacts' })}
      </WBTypography>
      <WBBox flex={1}>
        <Controller
          control={control}
          name={`bankDetails.accountName`}
          rules={inputs.bankDetails.accountName.rules}
          defaultValue={inputs.bankDetails.accountName.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type="text"
              variant="standard"
              label={inputs.bankDetails.accountName.label}
              placeholder={inputs.bankDetails.accountName.placeholder}
              error={!!errors?.bankDetails?.accountName}
              helperText={errors?.bankDetails?.accountName?.message || ''}
              margin="dense"
            />
          )}
        />
      </WBBox>
      <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`bankDetails.routingNumber`}
            rules={inputs.bankDetails.routingNumber.rules}
            defaultValue={inputs.bankDetails.routingNumber.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.bankDetails.routingNumber.label}
                placeholder={inputs.bankDetails.routingNumber.placeholder}
                error={!!errors?.bankDetails?.routingNumber}
                helperText={errors?.bankDetails?.routingNumber?.message || ''}
                margin="dense"
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name="bankDetails.accountNumber"
            defaultValue={inputs.bankDetails.accountNumber.defaultValue}
            rules={inputs.bankDetails.accountNumber.rules}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.bankDetails.accountNumber.label}
                placeholder={inputs.bankDetails.accountNumber.placeholder}
                error={!!errors?.bankDetails?.accountNumber}
                helperText={errors?.bankDetails?.accountNumber?.message || ''}
                margin="dense"
              />
            )}
          />
        </WBBox>
      </WBFlex>
      <WBFlex mt={[0, 4]}>
        <Controller
          control={control}
          name={`bankDetails.bankName`}
          rules={inputs.bankDetails.bankName.rules}
          defaultValue={inputs.bankDetails.bankName.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type="text"
              variant="standard"
              label={inputs.bankDetails.bankName.label}
              placeholder={inputs.bankDetails.bankName.placeholder}
              error={!!errors?.bankDetails?.bankName}
              helperText={errors?.bankDetails?.bankName?.message || ''}
              margin="dense"
            />
          )}
        />
      </WBFlex>
      <WBFlex
        flexDirection={['column', 'row']}
        mt={[0, 4]}
        alignItems={'center'}
      >
        <WBBox flex={1} pr={[0, 3]} width="100%">
          <Controller
            control={control}
            name="bankDetails.accountType"
            defaultValue={BankAccountType.checking}
            rules={{}}
            render={({ field }) => (
              <WBSelect
                {...field}
                options={[
                  {
                    value: 'savings',
                    label: t('savings', { ns: 'settings' }),
                  },
                  {
                    value: 'checking',
                    label: t('checking', { ns: 'settings' }),
                  },
                ]}
                label={t('accountType', { ns: 'settings' })}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]} width="100%">
          <Controller
            control={control}
            name="bankDetails.holderType"
            defaultValue={BankHolderType.personal}
            rules={{}}
            render={({ field }) => (
              <WBSelect
                {...field}
                options={[
                  {
                    value: 'business',
                    label: t('business', { ns: 'settings' }),
                  },
                  {
                    value: 'personal',
                    label: t('personal', { ns: 'settings' }),
                  },
                ]}
                label={t('holderType', { ns: 'settings' })}
              />
            )}
          />
        </WBBox>
      </WBFlex>

      <WBTypography
        mt={5}
        variant={islg ? 'h3' : 'h2'}
        noWrap
        component="div"
        color="dark"
        sx={{ flexGrow: 1, textAlign: 'left' }}
      >
        {t('bpayDetails', { ns: 'contacts' })}
      </WBTypography>
      <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`bpay.billerCode`}
            defaultValue={inputs.bpay.billerCode.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.bpay.billerCode.type}
                variant="standard"
                label={inputs.bpay.billerCode.label}
                placeholder={inputs.bpay.billerCode.placeholder}
                error={!!errors?.bpay?.billerCode}
                helperText={errors?.bpay?.billerCode?.message || ''}
                margin="dense"
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name={`bpay.referenceNumber`}
            defaultValue={inputs.bpay.referenceNumber.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.bpay.referenceNumber.type}
                variant="standard"
                label={inputs.bpay.referenceNumber.label}
                placeholder={inputs.bpay.referenceNumber.placeholder}
                error={!!errors?.bpay?.referenceNumber}
                helperText={errors?.bpay?.referenceNumber?.message || ''}
                margin="dense"
              />
            )}
          />
        </WBBox>
      </WBFlex>
    </WBBox>
  );
}

export default ContactBankForm;
