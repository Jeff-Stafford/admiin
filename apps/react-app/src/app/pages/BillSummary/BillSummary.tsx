import {
  WBBox,
  WBDivider,
  WBFlex,
  WBForm,
  WBTypography,
} from '@admiin-com/ds-web';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { alpha, useTheme } from '@mui/material';
import {
  BillCreateFormData,
  TaskCreation,
  useTaskCreationContext,
} from '../TaskCreation/TaskCreation';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { cloneContactWithSearchName } from '../../components/ContactDetail/ContactDetail';
import {
  Contact,
  PaymentFrequency,
  Task,
  TaskGuest,
  TaskType,
} from '@admiin-com/ds-graphql';
import PdfViewer from '../../components/PdfViewer/PdfViewer';
import TaskSummaryCard from '../../components/TaskSummaryCard/TaskSummaryCard';

export const BillSummary = React.memo(function () {
  const { t } = useTranslation();
  const theme = useTheme();
  const { handleSubmit: onSubmit } = useTaskCreationContext();
  const values = useWatch<BillCreateFormData>();
  // const documents = useWatch({ name: 'documents' });
  const { handleSubmit, control } = useFormContext();
  // const image = documents?.[0];

  const isTax = values.from?.metadata?.subCategory === 'TAX';
  const isBpay = !isTax && values.from?.metadata?.payoutMethod === 'BPAY';

  const dueDate = useMemo(() => {
    let dueAt;
    if (isTax) {
      dueAt = values.paymentAt;
    } else if (values.paymentFrequency !== PaymentFrequency.ONCE) {
      dueAt = values.firstPaymentAt;
    } else {
      dueAt = values.dueAt;
    }
    return dueAt;
  }, [
    isTax,
    values.dueAt,
    values.firstPaymentAt,
    values.paymentAt,
    values.paymentFrequency,
  ]);

  return (
    <WBFlex
      flexDirection={['column', 'row']}
      justifyContent={'center'}
      mt={[2, 8, 10]}
    >
      <Controller
        control={control}
        name="documents"
        render={({ field }) =>
          field.value?.[0]?.src ? (
            <WBFlex
              flexDirection={'column'}
              height={['550px', '630px']}
              flex={{ sm: 6 }}
              // px={[0, 5, 10]}
              pr={[0, 2, 3]}
              mb={[3, 10]}
            >
              <PdfViewer
                documentUrl={field.value?.[0]?.src}
                annotations={values?.annotations}
              />
            </WBFlex>
          ) : (
            <WBFlex />
          )
        }
      />
      <WBForm
        flex={6}
        onSubmit={handleSubmit(onSubmit)}
        alignItems={'start'}
        display="flex"
        flexDirection={'column'}
        justifyContent={'center'}
        mt={0}
        pl={[0, 2, 3]}
        mb={3}
      >
        <TaskSummaryCard task={values as any} />
        <TaskCreation.SubmitButtons />
      </WBForm>
    </WBFlex>
  );
});
