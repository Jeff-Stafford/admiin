import {
  daysDifference,
  frontDateFromBackendDate,
  numberWithCommasDecimals,
} from '@admiin-com/ds-common';
import {
  CSGetSub as GET_SUB,
  Payment,
  PaymentStatus,
  Task,
  TaskPaymentStatus,
  TaskSettlementStatus,
  TaskSignatureStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import { useTheme, WBBox, WBTypography } from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getTaskDueDate,
  isDeclinedTask,
  isPaidTask,
  isPendingTask,
  isTaskScheduled,
} from '../../helpers/tasks';

export const useTaskProperty = (task: Task | null | undefined) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isPaid = isPaidTask(task);
  const isScheduled = isTaskScheduled(task);
  const dueDate = React.useMemo(() => getTaskDueDate(task), [task]);

  const isPayment =
    task?.type === TaskType.PAY_ONLY || task?.type === TaskType.SIGN_PAY;

  const payments = task?.payments?.items;

  const totalInstallments = payments?.length ?? 0;
  const paidInstallments = payments?.filter(
    (payment) => payment?.status === PaymentStatus.COMPLETED
  ).length;

  const scheduledDate =
    totalInstallments > 0
      ? daysDifference(payments?.[0]?.scheduledAt ?? new Date().toString())
      : 0;

  const scheduledAt = new Date(payments?.[0]?.scheduledAt ?? new Date());
  const remainedAmount =
    payments
      ?.filter((payment) => payment?.status !== PaymentStatus.COMPLETED)
      .reduce(
        (sum, payment) =>
          sum + (payment && payment.amount ? payment.amount : 0),
        0
      ) ?? 0;

  const scheduledToolTip = (
    <>
      {t('invoiceWillExcutedIn', { ns: 'taskbox' })}{' '}
      <b>
        {t(
          scheduledDate === 0 ? 'today' : scheduledDate === 1 ? 'day' : 'days',
          {
            ns: 'taskbox',
            day: scheduledDate,
          }
        )}
      </b>{' '}
      {t('usingYourPaymentMethod', { ns: 'taskbox' })}{' '}
      {/* {maskCreditCardNumberSimple(task)} */}
    </>
  );
  const dueToolTip = (
    <WBBox>
      {task?.lodgementAt && (
        <WBTypography
          fontSize={'inherit'}
          color={'common.black'}
          fontWeight={'inherit'}
        >
          {`${t('lodgementDate', {
            ns: 'taskbox',
          })}`}
          <b> {frontDateFromBackendDate(task?.lodgementAt ?? '')}</b>
        </WBTypography>
      )}
      <WBTypography
        fontSize={'inherit'}
        color={'common.black'}
        fontWeight={'inherit'}
      >
        {`${t(
          task?.type === TaskType.SIGN_ONLY ? 'signatureDueOn' : 'paymentDueOn',
          {
            ns: 'taskbox',
          }
        )}`}
        <b> {frontDateFromBackendDate(task?.dueAt ?? '')}</b>
      </WBTypography>
    </WBBox>
  );
  const declinedToolTip = (
    <span style={{ color: theme.palette.error.main }}>{`${t(
      'paymentDeclined'
    )}`}</span>
  );

  const installmentTooltip = (
    <WBBox>
      {payments?.map((payment, index) => (
        <WBTypography
          fontSize={'inherit'}
          color={'common.black'}
          fontWeight={'inherit'}
          key={payment?.id}
        >
          {t('installment', { ns: 'taskbox' })} <b>{index + 1}</b>
          <b>
            {' '}
            {` - `}
            {`$${numberWithCommasDecimals((payment?.amount ?? 0) / 100)}`}{' '}
            <span
              style={{
                color:
                  payment?.status === PaymentStatus.COMPLETED
                    ? theme.palette.success.main
                    : payment?.status === PaymentStatus.SCHEDULED ||
                      payment?.status ===
                        PaymentStatus.PENDING_USER_CONFIRMATION ||
                      payment?.status === PaymentStatus.VOIDED ||
                      payment?.status === PaymentStatus.USER_CONFIRMED
                    ? theme.palette.warning.main
                    : 'inherit',
              }}
            >
              {t(payment?.status ?? '', { ns: 'taskbox' })}
            </span>
          </b>{' '}
          {payment?.status === PaymentStatus.SCHEDULED
            ? t('toBePaid', { ns: 'taskbox' })
            : ''}
          {` ${t('on', { ns: 'taskbox' })} `}
          <b> {frontDateFromBackendDate(payment?.scheduledAt ?? '')}</b>
        </WBTypography>
      ))}
    </WBBox>
  );

  const isInstallments = totalInstallments > 1;

  const { data: subData } = useQuery(gql(GET_SUB));

  const isAchivableByStatus =
    (task?.paymentStatus === TaskPaymentStatus.NOT_PAYABLE ||
      task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT) &&
    (task?.signatureStatus === TaskSignatureStatus.NOT_SIGNABLE ||
      task?.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE);

  const isAchivableByEntity = task?.createdBy === subData?.sub;

  const isCreatedBy = task?.createdBy === subData?.sub;

  const isAchivable = isAchivableByStatus && isAchivableByEntity;

  const isPending = isPendingTask(task);
  const isDeclined = isDeclinedTask(task);
  const isPayID =
    payments?.[0]?.status === PaymentStatus.PENDING_PAYID_TRANSFER;

  const isPayable =
    task?.type !== TaskType.SIGN_ONLY &&
    task?.settlementStatus !== TaskSettlementStatus.REFUNDABLE;

  const isDownloadable = task?.type !== TaskType.PAY_ONLY;

  const tooltip = isInstallments
    ? installmentTooltip
    : isDeclined
    ? declinedToolTip
    : isScheduled
    ? scheduledToolTip
    : dueToolTip;

  return {
    isPaid,
    isPayID,
    isPending,
    isScheduled,
    isDeclined,
    isInstallments,
    dueDate,
    tooltip,
    isAchivable,
    isDownloadable,
    isPayment,
    remainedAmount,
    totalInstallments,
    paidInstallments,
    isCreatedBy,
    scheduledAt,
    isPayable,
    scheduledDate,
  };
};
