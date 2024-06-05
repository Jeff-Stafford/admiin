import { DateTime } from 'luxon';
import { i18n } from '../i18n';

export const getTomorrowDate = () => {
  // Create a new Date object representing the current date and time
  const today = new Date();

  // Create a new Date object for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return tomorrow;
};

export const getExpiry = (expiresAt: string) => {
  const expiry = DateTime.fromISO(expiresAt)
    .diffNow(['days', 'hours'])
    .toObject();
  const { days, hours, minutes } = expiry;

  if (!hours || hours <= 0) return i18n.t('expiredTitle', { ns: 'common' });

  if (days && days > 1) {
    return `${i18n.t('expiresInTitle', { ns: 'common' })} ${parseInt(
      days.toString()
    )} ${
      days === 1
        ? i18n.t('day', { ns: 'common' })
        : i18n.t('days', { ns: 'common' })
    } ${
      hours > 0
        ? `${parseInt(hours.toString())} ${
            hours === 1
              ? i18n.t('hour', { ns: 'common' })
              : i18n.t('hours', { ns: 'common' })
          }`
        : ''
    } ${
      minutes && hours < 1 && hours > 0
        ? `${parseInt(minutes.toString())} ${
            minutes === 1
              ? i18n.t('minute', { ns: 'common' })
              : i18n.t('minutes', { ns: 'common' })
          }`
        : ''
    }`;
  }

  return `${i18n.t('expiresInTitle', { ns: 'common' })} ${parseInt(
    hours.toString()
  )} ${
    hours === 1
      ? i18n.t('hour', { ns: 'common' })
      : i18n.t('hours', { ns: 'common' })
  }`;
};
