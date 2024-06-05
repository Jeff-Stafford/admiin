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

export const getGstAmount = {}; //TODO: refactor location of this? and the file
export interface GetPaymentAmount {
  amount: number;
  installments?: number;
  isFirstInstallment?: boolean;
  isTaxBill: boolean;
}

export const getTaskPaymentAmount = ({
  amount,
  installments = 1,
  isFirstInstallment = false,
  isTaxBill,
}: GetPaymentAmount) => {
  let totalAmount = amount;
  if (!isTaxBill && installments > 1) {
    totalAmount = totalAmount + totalAmount * 1.024; //2.4% to seller
  }

  if (installments > 1) {
    const amountPerInstallment = Math.floor(totalAmount / installments);

    // first installment + remainder cents
    if (isFirstInstallment) {
      const remainder = totalAmount % installments;
      return amountPerInstallment + remainder;
    }

    return amountPerInstallment;
  }

  return totalAmount;
};

interface getGstPaymentAmount extends GetPaymentAmount {
  amount: number;
  installments?: number;
  isFirstInstallment?: boolean;
  isTaxBill: boolean;
  gstInclusive: boolean;
}

export const getTaskPaymentGstAmount = ({
  amount,
  installments = 1,
  isFirstInstallment = false,
  isTaxBill,
  gstInclusive,
}: getGstPaymentAmount) => {
  if (gstInclusive) {
    return (
      getTaskPaymentAmount({
        amount,
        installments,
        isFirstInstallment,
        isTaxBill,
      }) / 11
    );
  }

  return 0;
};
