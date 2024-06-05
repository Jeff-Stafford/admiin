import {
  WBList,
  WBListItem,
  WBListItemText,
  WBTypography,
} from '@admiin-com/ds-web';
import { Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

const Notifications = () => {
  const { t } = useTranslation();

  return (
    <PageContainer sx={{ py: 0 }}>
      <WBTypography variant="h1">
        {t('notificationsTitle', { ns: 'common' })}
      </WBTypography>

      <WBList subheader="">
        <WBListItem secondaryAction={<Switch />}>
          <WBListItemText>
            {t('emailNotificationsTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
        <WBListItem secondaryAction={<Switch />}>
          <WBListItemText>
            {t('pushNotificationsTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
        <WBListItem secondaryAction={<Switch />}>
          <WBListItemText>
            {t('smsNotificationsTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
      </WBList>
    </PageContainer>
  );
};

export default Notifications;
