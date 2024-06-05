import { DateTime } from 'luxon';
import { DATE_FORMATS } from '../constants';

/**
 * Formats a date to a user friendly date
 *
 * @param backendDate
 */
export const userDateFromBackendDate = (backendDate: string) => {
  return DateTime.fromFormat(backendDate, DATE_FORMATS.BACKEND_DATE).toFormat(
    DATE_FORMATS.USER_DATE
  );
};

export const dateTimeFormatFromISO = (isoDate: string) => {
  const date = DateTime.fromISO(isoDate).setZone('local');
  const now = DateTime.now();

  let datePrefix = '';

  if (date.hasSame(now, 'day')) {
    datePrefix = 'Today';
  } else if (date.plus({ days: 1 }).hasSame(now, 'day')) {
    datePrefix = 'Yesterday';
  } else {
    // For other dates, we show the full date in a readable format
    datePrefix = date.toFormat('MMMM dd, yyyy');
  }

  return `${datePrefix} at ${date.toFormat('hh:mm a')}`;
};

export const frontDateFromBackendDate = (backendDate: string) => {
  return DateTime.fromFormat(backendDate, DATE_FORMATS.BACKEND_DATE).toFormat(
    DATE_FORMATS.FRONT_DATE
  );
};
export const frontDateFromUnixSeconds = (date: number) => {
  return DateTime.fromSeconds(date).toFormat(DATE_FORMATS.FRONT_DATE);
};
export const frontDateFromISO = (date: string) => {
  return DateTime.fromISO(date).toFormat(DATE_FORMATS.FRONT_DATE);
};
export const userDateFromISO = (date: string) => {
  return DateTime.fromISO(date)
    .setZone('local')
    .toFormat(DATE_FORMATS.USER_DATE);
};

export const userDateFromUnixSeconds = (date: number) => {
  return DateTime.fromSeconds(date).toFormat(DATE_FORMATS.USER_DATE);
};
export const backendDateFromUnixSeconds = (date: number) => {
  return DateTime.fromSeconds(date).toFormat(DATE_FORMATS.BACKEND_DATE);
};
