import {
  createPaymentMethod as CREATE_PAYMENT_METHOD,
  PaymentMethodType,
  AccountDirection,
  PaymentMethod,
  entityUsersByUser,
  ContactBankAccount,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBSelect,
  WBTextField,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '@mui/material';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { Controller, useForm } from 'react-hook-form';
import { Error, HosteadField, useHostedFields } from './useHostedFields';
import DirectDebitForm from '../DirectDebitForm/DirectDebitForm';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
/* eslint-disable-next-line */
export interface BankFormProps {}

interface HostedFieldsFormProps {
  accountDirection?: AccountDirection;
  hasAgreement?: boolean;
  onSuccess: (paymentMethod: PaymentMethod) => void;
}
interface FieldErrors {
  [key: string]: string | undefined;
}
type BankAccountForm = {
  bankName: string;
  accountType: 'savings' | 'checking';
  holderType: 'personal' | 'business';
  country: 'AUS' | 'USA';
  paymentCurrency: 'AUD' | 'USD';
  currency: 'AUD' | 'USD';
};
export const BankForm: React.FC<HostedFieldsFormProps> = ({
  onSuccess,
  hasAgreement,
  accountDirection,
}) => {
  const [viewMode, setViewMode] = React.useState<'BankForm' | 'AgreementForm'>(
    'BankForm' as const
  );
  const { t } = useTranslation();
  const [account, setAccount] = React.useState<ContactBankAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<any>({});
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId || '';
  const [hostedField, setHostedField] = React.useState<any>(null);
  const { entity } = useSelectedEntity();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BankAccountForm>({});

  const [createPaymentMethod] = useMutation(gql(CREATE_PAYMENT_METHOD), {
    refetchQueries: [gql(entityUsersByUser)],
  });
  const { fieldStyles, token, user_id, fetchTokenUserId } = useHostedFields({
    entityId,
  });
  React.useEffect(() => {
    fetchTokenUserId();
  }, [fetchTokenUserId]);

  const hostFieldRef = React.useRef(true);

  React.useEffect(() => {
    if (hostedField) return;
    if (!hostFieldRef.current) return;
    hostFieldRef.current = false;
    const hostedFields = assembly.hostedFields({ environment: 'pre-live' });
    try {
      setHostedField(hostedFields);
      const accountName = hostedFields.create('bankAccountName', {
        placeholder: 'Smith John',
        styles: fieldStyles,
      });
      const routingNumber = hostedFields.create('bankRoutingNumber', {
        placeholder: '000-000',
        styles: fieldStyles,
      });
      const accountNumber = hostedFields.create('bankAccountNumber', {
        placeholder: '0000000000000000',
        styles: fieldStyles,
      });

      accountName.mount('#account-name-field');
      routingNumber.mount('#routing-number-field');
      accountNumber.mount('#account-number-field');

      const inputs = [accountName, routingNumber, accountNumber];

      inputs.forEach((field) => {
        field.on('change', (event: any) => {
          console.log(event);
          setFieldErrors((prevState) => ({
            ...prevState,
            [event.fieldType]: event.error ? event.error.message : undefined,
          }));
        });
      });
    } catch (err) {
      console.log(err);
    }

    return () => {
      hostedFields.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: BankAccountForm) => {
    setError({});
    const hasFieldError =
      Object.values(fieldErrors).filter((value) => value).length > 0;
    if (!hasFieldError) {
      try {
        setIsSubmitting(true);
        if (!token || !user_id) await fetchTokenUserId();
        hostedField
          .createBankAccount({
            token,
            user_id,
            bank_name: data.bankName,
            account_type: data.accountType,
            holder_type: data.holderType,
            country: data.country,
            payout_currency: data.paymentCurrency,
            currency: data.currency,
          })
          .then(async (response: any) => {
            try {
              const { id, bank } = response.bank_accounts;
              setAccount({
                __typename: 'ContactBankAccount',
                id: id,
                accountName: bank.account_name,
                bankName: bank.bank_name,
                accountNumber: bank.account_number,
                routingNumber: bank.routing_number,
                holderType: bank.holder_type,
                accountType: bank.account_type,
              });
              const paymentMethodId = id;
              if (!hasAgreement) {
                const createdPaymentMethodData = await createPaymentMethod({
                  variables: {
                    input: {
                      entityId,
                      paymentMethodId,
                      paymentMethodType: PaymentMethodType.BANK,
                      accountDirection:
                        accountDirection ?? AccountDirection.PAYMENT,
                    },
                  },
                  // TODO: refetch or cache update
                });
                const createdPaymentMethod =
                  createdPaymentMethodData?.data?.createPaymentMethod;
                onSuccess(createdPaymentMethod);
              } else {
                setViewMode('AgreementForm');
              }
            } catch (err) {
              console.log(err);
              setError(err);
            } finally {
              setIsSubmitting(false);
            }
          })
          .catch((response: any) => {
            setIsSubmitting(false);
            if (response.errors && response.errors.token) {
              setError({ message: 'Your token is not authorized' });
            } else if (
              response.errors &&
              response.errors.provider_response_message
            ) {
              setError(
                JSON.parse(response.errors.provider_response_message[0])
              );
            } else if (response.errors && response.errors.routing_number) {
              console.log(response.errors.routing_number);
              setFieldErrors({
                ...fieldErrors,
                bankRoutingNumber: `${'routing number'} ${
                  response.errors.routing_number[0]
                }`,
              });
            } else {
              setError({
                message: 'There was an error creating your card account.',
              });
            }
          });
      } catch (error) {
        setError(error);
      } finally {
        // setIsSubmitting(false);
      }
    }
  };
  return viewMode === 'BankForm' ? (
    <WBForm onSubmit={handleSubmit(onSubmit)} id="add-payment-form" mt={3}>
      <WBBox>
        <InputLabel focused htmlFor="account-name-field">
          {t('accountName', { ns: 'settings' })}
        </InputLabel>
        <HosteadField id="account-name-field" className="hosted-field" />
        {fieldErrors.bankAccountName && (
          <Error>{fieldErrors.bankAccountName}</Error>
        )}
      </WBBox>
      <WBFlex mt={3}>
        <WBBox flex={1} mr={3}>
          <InputLabel focused htmlFor="routing-number-field">
            {t('routingNumber', { ns: 'settings' })}
          </InputLabel>
          <HosteadField
            id="routing-number-field"
            className="hosted-field"
          ></HosteadField>
          {fieldErrors.bankRoutingNumber && (
            <Error>{fieldErrors.bankRoutingNumber}</Error>
          )}
        </WBBox>
        <WBBox flex={1}>
          <InputLabel focused htmlFor="routing-number-field">
            {t('accountNumber', { ns: 'settings' })}
          </InputLabel>
          <HosteadField
            id="account-number-field"
            className="hosted-field"
          ></HosteadField>
          {fieldErrors.bankAccountNumber && (
            <Error>{fieldErrors.bankAccountNumber}</Error>
          )}
        </WBBox>
      </WBFlex>
      <WBFlex flexDirection={'row'} alignItems="center">
        <WBBox flex={1}>
          <Controller
            control={control}
            name="bankName"
            defaultValue={''}
            rules={{ required: t('bankNameRequired', { ns: 'settings' }) }}
            render={({ field }) => (
              <WBTextField
                {...field}
                label={t('bankName', { ns: 'settings' })}
                error={!!(errors.bankName && errors.bankName.message)} // Add error handling
                helperText={(errors.bankName && errors.bankName.message) || ''} // Add helper text for errors
              />
            )}
          />
          {/* {!!errors.bankName && <Error>{errors.bankName?.message}</Error>} */}
        </WBBox>
      </WBFlex>

      <WBFlex flexDirection={'row'} alignItems="center">
        <WBBox flex={1} mr={3}>
          <Controller
            control={control}
            name="accountType"
            defaultValue={'checking'}
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
        <WBBox flex={1}>
          <Controller
            control={control}
            name="holderType"
            defaultValue={'personal'}
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

      <WBFlex flexDirection={'row'} alignItems="center">
        <WBBox flex={1}>
          <Controller
            control={control}
            name="country"
            defaultValue={'AUS'}
            rules={{}}
            render={({ field }) => (
              <WBSelect
                {...field}
                options={[
                  { value: 'AUS', label: t('AUS', { ns: 'settings' }) },
                  //{ value: 'USA', label: t('USA', { ns: 'settings' }) },
                ]}
                label={t('country', { ns: 'settings' })}
              />
            )}
          />
        </WBBox>
      </WBFlex>

      <WBFlex flexDirection={'row'} alignItems="center">
        <WBBox flex={1} mr={3}>
          <Controller
            control={control}
            name="paymentCurrency"
            defaultValue={'AUD'}
            rules={{}}
            render={({ field }) => (
              <WBSelect
                {...field}
                options={[
                  { value: 'AUD', label: t('AUD', { ns: 'settings' }) },
                  //{ value: 'USD', label: t('USD', { ns: 'settings' }) },
                ]}
                label={t('paymentCurrency', { ns: 'settings' })}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1}>
          <Controller
            control={control}
            name="currency"
            defaultValue={'AUD'}
            rules={{}}
            render={({ field }) => (
              <WBSelect
                {...field}
                options={[
                  { value: 'AUD', label: t('AUD', { ns: 'settings' }) },
                  //{ value: 'USD', label: t('USD', { ns: 'settings' }) },
                ]}
                label={t('currency', { ns: 'settings' })}
              />
            )}
          />
        </WBBox>
      </WBFlex>
      <WBButton fullWidth sx={{ mt: 7 }} type="submit" loading={isSubmitting}>
        {hasAgreement && accountDirection === AccountDirection.PAYMENT
          ? t('continue', { ns: 'common' })
          : t('addBankAccount', { ns: 'settings' })}
      </WBButton>

      <ErrorHandler errorMessage={error?.message} />
    </WBForm>
  ) : (
    <DirectDebitForm account={account} entity={entity} onSuccess={onSuccess} />
  );
};
