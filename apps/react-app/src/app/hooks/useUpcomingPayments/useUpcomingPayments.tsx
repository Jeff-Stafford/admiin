import { gql, useLazyQuery } from '@apollo/client';
import { useUserEntities } from '../useUserEntities/useUserEntities';
import {
  Entity,
  Payment,
  tasksByEntityTo as TASKS_BY_ENTITY_FROM,
  Task,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { isUpcomingPayment } from '../../helpers/payments';
export const useUpcomingPayments = () => {
  const { userEntities: entites } = useUserEntities();
  const [tasksByEntityTo] = useLazyQuery(gql(TASKS_BY_ENTITY_FROM), {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-only',
  });
  const [paymentsData, setPaymentsData] = React.useState<
    { payment: Payment; entity: Entity; task: Task }[]
  >([]);

  React.useEffect(() => {
    if (entites) {
      entites.forEach(async (entity: Entity) => {
        if (!entity || !entity.id) return;
        try {
          const tasksByEntityToData = await tasksByEntityTo({
            variables: {
              entityId: entity.id,
              status: 'INCOMPLETE',
              limit: 100,
            },
          });
          const tasks = tasksByEntityToData?.data?.tasksByEntityTo?.items || [];

          const results: { payment: Payment; entity: Entity; task: Task }[] =
            [];
          for (const task of tasks) {
            if (
              entity &&
              task?.payments?.items &&
              task?.payments?.items.length > 0
            )
              for (const payment of task.payments.items) {
                if (payment && isUpcomingPayment(payment)) {
                  results.push({ entity, payment, task });
                }
              }
          }
          setPaymentsData((data) => [...data, ...results]);
        } catch (err) {
          console.log(err);
        }
      });
    }
  }, [entites]);

  return { paymentsData };
};
