import {
  createPaymentMethod as CREATE_PAYMENT_METHOD,
  PaymentMethodType,
  AccountDirection,
  PaymentMethod,
  entityUsersByUser,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBIcon,
  WBSvgIcon,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import React, { FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AdmiinLogo from '../../../assets/icons/admiin.svg';
import { InputLabel } from '@mui/material';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { Error, HosteadField, useHostedFields } from './useHostedFields';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';

interface HostedFieldsFormProps {
  onSuccess?: (paymentMethod: PaymentMethod | string) => void;
  isGuest?: boolean;
  taskId?: string | undefined;
  paid?: boolean;
  onSubmit?: (e: FormEvent) => Promise<boolean>;
  submitButtonText?: string;
  entityId?: string | undefined;
}
interface FieldErrors {
  [key: string]: string | undefined;
}
export const CCForm: React.FC<HostedFieldsFormProps> = ({
  onSuccess,
  taskId,
  isGuest = false,
  paid,
  onSubmit,
  submitButtonText,
  entityId,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<any>({});
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const { entity } = useSelectedEntity();
  entityId = entityId || selectedEntityIdData?.selectedEntityId || '';
  const [hostedField, setHostedField] = React.useState<any>(null);
  const [hostedFields, setHostedFields] = React.useState<any>([]);

  const [createPaymentMethod] = useMutation(gql(CREATE_PAYMENT_METHOD), {
    update(cache, { data: { createPaymentMethod } }) {
      if (entity)
        cache.modify({
          id: cache.identify(entity),
          fields: {
            paymentMethods(existingPaymentMethodsRef = {}, { readField }) {
              // Create a new payment method object to add.
              // Write the new payment method into the cache.
              const newPaymentMethodRef = cache.writeFragment({
                data: createPaymentMethod,
                fragment: gql`
                  fragment NewPaymentMethod on PaymentMethod {
                    id
                    paymentMethodType
                    number
                  }
                `,
              });
              // Prepare the updated items array.
              // Ensure the existing `items` array is correctly read from the existing reference.
              const existingItems = existingPaymentMethodsRef.items
                ? (readField(
                    'items',
                    existingPaymentMethodsRef
                  ) as PaymentMethod[])
                : [];
              // Return the updated paymentMethods object with the new payment method included.
              console.log(
                createPaymentMethod,
                existingItems,
                newPaymentMethodRef
              );
              return {
                ...existingPaymentMethodsRef,
                items: [...existingItems, newPaymentMethodRef],
              };
            },
          },
        });
    },
  });

  const hostFieldRef = useRef(true);

  const { fieldStyles, token, user_id, fetchTokenUserId } = useHostedFields({
    isGuest,
    taskId,
    entityId,
  });

  React.useEffect(() => {
    if (hostedField) return;
    if (!hostFieldRef.current) return;
    hostFieldRef.current = false;
    try {
      const hostedFields = assembly.hostedFields({ environment: 'pre-live' });
      setHostedField(hostedFields);
      const cardName = hostedFields.create('cardName', {
        placeholder: 'Full Name',
        styles: fieldStyles,
      });
      const cardNumber = hostedFields.create('cardNumber', {
        placeholder: '•••• •••• •••• ••••',
        styles: fieldStyles,
      });
      const cardExpiry = hostedFields.create('cardExpiry', {
        placeholder: 'MM/YY',
        styles: fieldStyles,
      });
      const cardCvv = hostedFields.create('cardCvv', {
        placeholder: '•••',
        styles: fieldStyles,
      });

      cardName.mount('#card-name-field');
      cardNumber.mount('#card-number-field');
      cardExpiry.mount('#card-expiry-field');
      cardCvv.mount('#card-cvv-field');

      const inputs = [cardName, cardNumber, cardExpiry, cardCvv];
      setHostedFields([cardName, cardNumber, cardExpiry, cardCvv]);

      inputs.forEach((field) => {
        field.on('change', (event: any) => {
          setFieldErrors((prevState) => ({
            ...prevState,
            [event.fieldType]: event.error ? event.error.message : undefined,
          }));
        });
      });

      // TODO: on ready for the submit button enable and change form size
    } catch (err) {
      console.log("couldn't initialize hosted field", { err });
    }

    return () => {
      hostedField?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError({});
      if (onSubmit)
        if (!(await onSubmit(e))) {
          setIsSubmitting(false);
          return;
        }
      const hasFieldError =
        Object.values(fieldErrors).filter((value) => value).length > 0;
      if (!hasFieldError && hostedField) {
        if (!token || !user_id) await fetchTokenUserId();
        hostedField
          .createCardAccount({
            token,
            user_id,
          })
          .then(async (response: any) => {
            try {
              const paymentMethodId = response.card_accounts.id;
              if (!isGuest) {
                const createdPaymentMethodData = await createPaymentMethod({
                  variables: {
                    input: {
                      entityId,
                      paymentMethodId,
                      paymentMethodType: PaymentMethodType.CARD,
                      accountDirection: AccountDirection.PAYMENT,
                    },
                  },
                });
                const createdPaymentMethod =
                  createdPaymentMethodData?.data?.createPaymentMethod;
                onSuccess && (await onSuccess(createdPaymentMethod));
              } else {
                onSuccess && (await onSuccess(paymentMethodId));
                hostedFields.forEach((field: any) => field.clear());
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
            } else {
              setError({
                message: 'There was an error creating your card account.',
              });
            }
          });
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error);
    }
  };
  return (
    <WBForm onSubmit={handleSubmit} id="add-payment-form" width={'100%'}>
      <WBBox className="cardName-container">
        <InputLabel focused htmlFor="card-name-field">
          {t('cardholderName', { ns: 'settings' })}
        </InputLabel>
        <HosteadField id="card-name-field" className="hosted-field" />
        {fieldErrors.cardName && <Error>{fieldErrors.cardName}</Error>}
      </WBBox>
      <WBBox className="cardNumber-container" mt={3}>
        <InputLabel focused htmlFor="card-number-field">
          {t('cardNumber', { ns: 'settings' })}
        </InputLabel>
        <HosteadField
          id="card-number-field"
          className="hosted-field"
        ></HosteadField>
        {fieldErrors.cardNumber && <Error>{fieldErrors.cardNumber}</Error>}
      </WBBox>
      <WBFlex flexDirection={'row'} alignItems="center" mt={3}>
        <WBBox className="cardExpiry-container" mr={3}>
          <InputLabel focused htmlFor="card-expiry-field">
            {t('expiryDate', { ns: 'settings' })}
          </InputLabel>
          <HosteadField
            id="card-expiry-field"
            className="hosted-field"
          ></HosteadField>
          {fieldErrors.cardExpiry && <Error>{fieldErrors.cardExpiry}</Error>}
        </WBBox>
        <WBBox className="cardCvv-container" ml={3}>
          <InputLabel focused htmlFor="card-cvv-field">
            CVV
          </InputLabel>
          <HosteadField
            id="card-cvv-field"
            className="hosted-field"
          ></HosteadField>
          {fieldErrors.cardCvv && <Error>{fieldErrors.cardCvv}</Error>}
        </WBBox>
      </WBFlex>
      {!paid ? (
        <WBButton fullWidth sx={{ mt: 7 }} type="submit" loading={isSubmitting}>
          {!isGuest ? (
            t('addCreditCard', { ns: 'settings' })
          ) : (
            <>
              {!isSubmitting && (
                <WBSvgIcon fontSize="small" sx={{ mr: 1 }}>
                  <AdmiinLogo />
                </WBSvgIcon>
              )}
              {submitButtonText || t('payInvoice', { ns: 'settings' })}
            </>
          )}
        </WBButton>
      ) : (
        <WBBox
          sx={{
            mt: 7,
            borderRadius: '50px',
            padding: 2,
            paddingX: 6,
            color: 'common.black',
            bgcolor: 'success.main',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <WBIcon
            name="Checkmark"
            color={'common.black'}
            size={'small'}
          ></WBIcon>
          {submitButtonText || t('invoicePaid', { ns: 'payment' })}
        </WBBox>
      )}
      <ErrorHandler errorMessage={error?.message} />
    </WBForm>
  );
};
