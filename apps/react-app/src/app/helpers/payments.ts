import { Payment, PaymentStatus, Task } from '@admiin-com/ds-graphql';
import { DateTime } from 'luxon';

export const isPayIDTask = (task: Task | null | undefined) => {
  const payments = task?.payments?.items;

  return payments?.[0]?.status === PaymentStatus.PENDING_PAYID_TRANSFER;
};
export const isUpcomingPayment = (payment: Payment) => {
  // Check if the payment has a confirmed status
  if (payment?.status === PaymentStatus.PENDING_USER_CONFIRMATION) {
    // Parse the scheduledAt date using Luxon from the ISO date string
    const scheduledDate = DateTime.fromISO(payment.scheduledAt ?? '');
    const now = DateTime.now();

    // Calculate the difference in hours
    const diffInHours = scheduledDate.diff(now, 'hours').hours;

    // Check if the difference is more than 48 hours
    if (diffInHours < 48) {
      return true;
    }
  }
  return false;
};
