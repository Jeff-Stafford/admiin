import { daysDifference } from '@admiin-com/ds-common';
import {
  Payment,
  PaymentFrequency,
  PaymentMethodType,
  PaymentStatus,
  Task,
  TaskCategory,
  TaskPaymentStatus,
  TaskSettlementStatus,
  TaskSignatureStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import { GST_RATE } from '../constants/config';

export function hasInstallmentTask(tasks: Task[]) {
  return tasks.some((task) => isInstallmentTask(task));
}

export function isDeclinedTask(task?: Task | null) {
  const isScheduled = isTaskScheduled(task);
  const isInstallments = isInstallmentTask(task);
  const payments = task?.payments?.items ?? [];
  return (
    isScheduled &&
    !isInstallments &&
    payments?.find(
      (payment: Payment | null) => payment?.status === PaymentStatus.DECLINED
    )
  );
}

export function isPaidTask(task?: Task | null) {
  if (!task) return false;
  return (
    task?.paymentStatus === TaskPaymentStatus.PAID ||
    task?.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID
  );
}

export function isPendingTask(task?: Task | null) {
  if (!task) return false;

  return (
    task?.paymentStatus ===
      TaskPaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION ||
    task?.paymentStatus === TaskPaymentStatus.PENDING_PAYID_TRANSFER
  );
}

export function isInstallmentTask(task?: Task | null) {
  if (!task) return false;

  return (
    ((task?.paymentFrequency === PaymentFrequency.WEEKLY ||
      task?.paymentFrequency === PaymentFrequency.FORTNIGHTLY ||
      task?.paymentFrequency === PaymentFrequency.MONTHLY ||
      task?.paymentFrequency === PaymentFrequency.QUARTERLY ||
      task?.paymentFrequency === PaymentFrequency.ANNUALLY) &&
      (task?.numberOfPayments || 0) > 1) ||
    (task?.payments?.items?.length || 0) > 1
  );
}
export function calculateFee(tasks: Task[], paymentType?: PaymentMethodType) {
  const fees: Record<string, number> = {};
  const payableName =
    tasks.length === 1 ? tasks[0].reference ?? 'payable' : 'payable';

  for (const task of tasks) {
    const isInstallment = isInstallmentTask(task);
    const isTax = task?.category === TaskCategory.TAX;
    const amount = task?.amount ?? 0;

    if (!fees[payableName]) {
      fees[payableName] = 0;
    }
    fees[payableName] += amount;

    if (isInstallment) {
      if (isTax) {
        if (!fees['atoFee']) {
          fees['atoFee'] = 0;
        }
        fees['atoFee'] += 88;
      } else {
        if (!fees['installmentFee']) {
          fees['installmentFee'] = 0;
        }
        fees['installmentFee'] += amount * 0.02;
      }
    }

    if (task?.gstInclusive) {
      if (!fees['gstFee']) {
        fees['gstFee'] = 0;
      }
      fees['gstFee'] += amount * (GST_RATE / 100);
    }

    if (paymentType) {
      if (paymentType === PaymentMethodType.CARD) {
        if (!fees['cardFee']) {
          fees['cardFee'] = 0;
        }
        fees['cardFee'] += amount * 0.022;
      } else if (paymentType === PaymentMethodType.BANK) {
        if (!fees['bankFee']) {
          fees['bankFee'] = 0;
        }
        fees['bankFee'] += 0.9;
      }
    }
  }

  const totalAmount = Object.values(fees).reduce((a, b) => a + b, 0);
  return { fees, totalAmount };
}

export function getTaskDueDate(task?: Task | null) {
  //TODO: need to update if tax bill, refundable, payable info is added
  const date =
    task?.settlementStatus === TaskSettlementStatus.REFUNDABLE
      ? task?.lodgementAt
      : task?.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE &&
        !!task?.lodgementAt
      ? task?.lodgementAt
      : task?.dueAt;
  return task ? daysDifference(date ?? new Date().toString()) : 0;
}
export function hasReOcurringTask(tasks: Task[]) {
  return tasks.some((task) => isReocurringTask(task));
}

export function isReocurringTask(task?: Task | null) {
  return (
    task?.paymentFrequency === PaymentFrequency.WEEKLY ||
    task?.paymentFrequency === PaymentFrequency.FORTNIGHTLY ||
    task?.paymentFrequency === PaymentFrequency.MONTHLY ||
    task?.paymentFrequency === PaymentFrequency.QUARTERLY ||
    task?.paymentFrequency === PaymentFrequency.ANNUALLY
  );
}
export function isPayableTask(task?: Task | null) {
  return (
    task?.type !== TaskType.SIGN_ONLY &&
    task?.settlementStatus !== TaskSettlementStatus.REFUNDABLE
  );
}

export function tasksSignPayLabel(tasks: Task[]): TaskType {
  let isPayable = false;
  let isSignable = false;
  for (const task of tasks) {
    if (!task) continue;
    if (
      task?.settlementStatus !== TaskSettlementStatus.REFUNDABLE &&
      task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT &&
      (task?.type === TaskType.PAY_ONLY || task?.type === TaskType.SIGN_PAY)
    )
      isPayable = true;
    if (
      task?.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE &&
      (task?.type === TaskType.SIGN_ONLY || task?.type === TaskType.SIGN_PAY)
    )
      isSignable = true;
  }
  if (isPayable && isSignable) return TaskType.SIGN_PAY;
  else if (isPayable && !isSignable) return TaskType.PAY_ONLY;
  else if (!isPayable && isSignable) return TaskType.SIGN_ONLY;
  return TaskType.SIGN_ONLY;
}

export function isTaskScheduled(task?: Task | null) {
  return task?.paymentStatus === TaskPaymentStatus.SCHEDULED;
}
export function hasTaskScheduled(tasks: Task[]) {
  return tasks.some(
    (task) => task?.paymentStatus === TaskPaymentStatus.SCHEDULED
  );
}
