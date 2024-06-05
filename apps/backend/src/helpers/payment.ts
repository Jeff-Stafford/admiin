import { PaymentStatus } from '/opt/API';
import { DateTime } from 'luxon';

export const getScheduledAtStatus = ({
  amount,
  scheduledAt,
}: {
  amount: number;
  scheduledAt: string;
}) => {
  const underThousand = amount < 1000 * 100;
  const within48Hours =
    DateTime.fromFormat(scheduledAt ?? '', 'yyyy-MM-dd').diffNow('hours')
      .hours < 48;
  return underThousand || within48Hours
    ? PaymentStatus.USER_CONFIRMED
    : PaymentStatus.SCHEDULED;
};
