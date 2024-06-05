import {
  NotificationStatus,
  notificationsByUser as NOTIFICATIONS_BY_USER,
  // onUpdateEntity as ON_UPDATE_ENTITY,
  updateNotification as UPDATE_NOTIFICATION,
  onCreateNotification as ON_CREATE_NOTIFICATION,
  OnCreateNotificationSubscription,
  Notification,
  // OnUpdateEntitySubscription,
} from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { useSnackbar } from '@admiin-com/ds-web';
import {
  OnDataOptions,
  gql,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { AlertColor } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
// import { useSelectedEntity } from '../useSelectedEntity/useSelectedEntity';

export function useNotificationService() {
  const { t } = useTranslation();
  const { data: sub } = useQuery(gql(GET_SUB));

  // const { entity } = useSelectedEntity();

  const { data, refetch } = useQuery(gql(NOTIFICATIONS_BY_USER), {
    variables: {
      filter: {
        status: {
          eq: NotificationStatus.UNREAD,
        },
      },
    },
  });

  const [updateNotification] = useMutation(gql(UPDATE_NOTIFICATION));

  const showSnackbar = useSnackbar();
  const showNotification = React.useCallback(
    (notification?: Notification | null, onClose?: () => void) => {
      if (notification && notification.status === NotificationStatus.UNREAD) {
        let message = '';
        if (notification?.title) {
          message = t(notification.title, { ns: 'notifications' });
        } else if (notification?.message) {
          message = t(notification.message, { ns: 'notifications' });
        }

        showSnackbar({
          message,
          severity: (notification?.type ?? 'info') as AlertColor | undefined,
          horizontal: 'center',
          vertical: 'bottom',
          onClose: async () => {
            await updateNotification({
              variables: {
                input: {
                  id: notification.id,
                  status: NotificationStatus.READ,
                },
              },
            });
            onClose && (await onClose());
          },
        });
      }
    },
    [t, showSnackbar, updateNotification]
  );

  useSubscription(
    gql`
      ${ON_CREATE_NOTIFICATION}
    `,
    {
      variables: {
        filter: {
          //TODO: may not be necessary
          owner: {
            eq: sub?.sub,
          },
        },
      },
      skip: !sub?.sub,
      onData: (data: OnDataOptions<OnCreateNotificationSubscription>) => {
        const notification = data?.data?.data?.onCreateNotification;
        showNotification(notification);
      },
    }
  );

  // useSubscription(
  //   gql`
  //     ${ON_UPDATE_ENTITY}
  //   `,
  //   {
  //     variables: {
  //       entityId: entity?.id,
  //     },
  //     skip: !entity?.id,
  //     onData: (data: OnDataOptions<OnUpdateEntitySubscription>) => {
  //       console.log(data);
  //       showSnackbar({
  //         message: t('entityUpdated', { ns: 'common' }),
  //         severity: 'info' as AlertColor | undefined,
  //         horizontal: 'center',
  //         vertical: 'bottom',
  //       });
  //     },
  //   }
  // );
  React.useEffect(() => {
    if (data) {
      const notification = data?.notificationsByUser?.items?.[0];
      showNotification(notification, () => refetch());
    }
  }, [data, refetch, showNotification]);
}
