import { DateTime } from 'luxon';

export const DATE_FORMATS = {
  BACKEND_DATE: 'yyyy-MM-dd',
  USER_DATE: 'dd/MM/yyyy',
  FRONT_DATE: 'LLL dd, yyyy',
};

export const isDateTimeInFuture = (isoDateTime: string) => {
  const { milliseconds } = DateTime.fromISO(isoDateTime).diffNow().toObject();
  if (!milliseconds) {
    return false;
  }

  return milliseconds > 0;
};

export function daysDifference(dateString: string): number {
  // Parse the date string into a Date object
  const specifiedDate = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInTime = specifiedDate.getTime() - currentDate.getTime();

  // Convert the difference in time to days
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  // Return the absolute value of the difference in days
  return Math.round(differenceInDays);
}

export function getDateNMonthsFromNow(n: number): Date {
  const currentDate: Date = new Date(); // Get the current date
  currentDate.setMonth(currentDate.getMonth() + n); // Add n months to the current date

  return currentDate;
}
