import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

/* eslint-disable-next-line */
export interface NotificationsMenuProps {}

export function NotificationsMenu(props: NotificationsMenuProps) {
  const { t } = useTranslation();

  return (
    <WBTypography>{t('notificationsTitle', { ns: 'common' })}</WBTypography>
  );
}

export default NotificationsMenu;
