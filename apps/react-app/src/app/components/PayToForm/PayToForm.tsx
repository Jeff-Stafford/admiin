import { PayToAgreement } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBLink,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import PayToIcon from '../PayToIcon/PayToIcon';
export const GET_UPDATE_PAY_TO_AGREEMENT = /* GraphQL */ `
  mutation GetUpdatePayToAgreement($input: GetUpdatePayToAgreementInput!) {
    getUpdatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
        id
        type
        taxNumber
        billerCode
        name
        legalName
        searchName
        zaiCompanyId
        zaiBankAccountId
        zaiDigitalWalletId
        zaiBpayCrn
        contact {
          firstName
          lastName
          email
        }
        phone
        paymentMethodId
        disbursementMethodId
        ubosCreated
        numUbosCreated
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
      }
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
const VALIDATE_PAY_TO_AGREEMENT = /* GraphQL */ `
  mutation ValidatePayToAgreement($input: ValidatePayToAgreementInput) {
    validatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
        id
        type
        taxNumber
        billerCode
        name
        legalName
        searchName
        zaiCompanyId
        zaiBankAccountId
        zaiDigitalWalletId
        zaiBpayCrn
        contact {
          firstName
          lastName
          email
        }
        phone
        paymentMethodId
        disbursementMethodId
        ubosCreated
        numUbosCreated
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
      }
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;

export interface PayToFormProps {
  onSuccess: (status: PayToAgreement[]) => void;
  onFailed: (type: 'CC' | 'PayID') => void;
}

type BankFormData = {
  bsb: string;
  accountNumber: string;
};

export function PayToForm({ onSuccess, onFailed }: PayToFormProps) {
  const methods = useForm<BankFormData>();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>({});
  const [validatePayToAgreement] = useMutation(gql(VALIDATE_PAY_TO_AGREEMENT));
  const [failedValidation, setFailedValidation] =
    React.useState<boolean>(false);

  const [getUpdatePayToAgreement] = useMutation(
    gql(GET_UPDATE_PAY_TO_AGREEMENT)
  );
  const { selectedTask: task, selectedTasks } = useTaskBoxContext();
  const { getBillPayments } = usePaymentContext();

  const entityId = useCurrentEntityId();
  const onSubmit = async (data: BankFormData) => {
    setLoading(true);
    try {
      const validationData = await validatePayToAgreement({
        variables: {
          input: {
            ...data,
            entityId,
            billPayments: getBillPayments(task ? [task] : selectedTasks),
            //description: 'REJECT_AGREEMENT',
          },
        },
      });
      const agreements: PayToAgreement[] =
        validationData?.data?.validatePayToAgreement;

      for (const agreement of agreements) {
        // TODO: we need to recursively call this until we get a status other than PENDING_VALIDATION
        const updatedAgreementData = await getUpdatePayToAgreement({
          variables: {
            input: {
              agreementUuid: agreement.agreementUuid,
            },
          },
        });

        const updatedAgreement =
          updatedAgreementData?.data?.getUpdatePayToAgreement;

        // const updatedStatus = updatedAgreement?.status;
        if (updatedAgreement?.status === 'VALIDATED') {
          onSuccess(agreements);
          //setFailedValidation(true);
          break;
        } else {
          setFailedValidation(true);
        }
      }
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();
  const input = {
    bsb: {
      label: t('bsb', { ns: 'common' }),
      placeholder: '123-456',
      defaultValue: '',
      rules: {
        required: t('bsbRequired', { ns: 'validation' }), // Assuming a translation key for the error message
        pattern: {
          value: /^\d+$/, // Regex pattern to ensure only digits are entered
          message: t('bsbInvalidFormat', { ns: 'validation' }), // Assuming a translation key for the error message
        },
      },
    },
    accountNumber: {
      label: t('accountNumber', { ns: 'common' }),
      placeholder: '123456789',
      defaultValue: '',
      rules: {
        required: t('accountNumberRequired', { ns: 'validation' }), // Assuming a translation key for the error message
        minLength: {
          value: 6,
          message: t('accountNumberTooShort', { ns: 'validation' }), // Assuming a translation key for the error message
        },
        maxLength: {
          value: 9,
          message: t('accountNumberTooLong', { ns: 'validation' }), // Assuming a translation key for the error message
        },
        pattern: {
          value: /^\d+$/, // Regex pattern to ensure only digits are entered
          message: t('accountNumberInvalidFormat', { ns: 'validation' }), // Assuming a translation key for the error message
        },
      },
    },
  };
  return (
    <WBForm onSubmit={handleSubmit(onSubmit)}>
      <WBFlex justifyContent={'space-between'} alignItems={'center'}>
        <WBBox flex={3}>
          <WBTypography>{t('payToHelper', { ns: 'payment' })}</WBTypography>
        </WBBox>
        <WBBox flex={1}>
          <PayToIcon type="PayTo" />
        </WBBox>
      </WBFlex>
      <Controller
        control={control}
        name="bsb"
        defaultValue={input.bsb.defaultValue}
        rules={input.bsb.rules}
        render={({ field }) => (
          <WBTextField
            {...field}
            label={input.bsb.label}
            placeholder={input.bsb.placeholder}
            error={!!errors?.bsb}
            helperText={errors?.bsb?.message || ''}
          />
        )}
      />
      <Controller
        control={control}
        defaultValue={input.accountNumber.defaultValue}
        name="accountNumber"
        rules={input.accountNumber.rules}
        render={({ field }) => (
          <WBTextField
            {...field}
            label={input.accountNumber.label}
            placeholder={input.accountNumber.placeholder}
            error={!!errors?.accountNumber}
            helperText={errors?.accountNumber?.message || ''}
          />
        )}
      />
      <WBButton loading={loading} sx={{ mt: 8 }} disabled={failedValidation}>
        {t('addBankAccount', { ns: 'settings' })}
      </WBButton>
      {failedValidation && (
        <WBTypography color={'error'} mt={5} mb={2}>
          {t('failedPayToDescription1', { ns: 'payment' })}
          <WBLink
            color={'error.main'}
            underline="always"
            onClick={(e) => {
              e.preventDefault();
              onFailed('CC');
            }}
          >
            {t('creditCard', { ns: 'payment' })}
          </WBLink>
          {t('failedPayToDescription2', { ns: 'payment' })}

          <WBLink
            color={'error.main'}
            underline="always"
            onClick={(e) => {
              e.preventDefault();
              onFailed('PayID');
            }}
          >
            {t('payID', { ns: 'payment' })}
          </WBLink>
        </WBTypography>
      )}
      <WBTypography color={'error'}></WBTypography>
      <ErrorHandler errorMessage={error?.message} />
    </WBForm>
  );
}

export default PayToForm;
