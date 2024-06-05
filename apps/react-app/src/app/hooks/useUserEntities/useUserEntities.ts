import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import {
  Entity,
  EntityUser,
  EntityUserRole,
  entityUsersByUser as LIST_ENTITY_USERS,
  PaymentMethod,
  PaymentMethodType,
  entityUsersByUser,
} from '@admiin-com/ds-graphql';
import { useLayoutEffect, useMemo } from 'react';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { cloneDeep } from '@apollo/client/utilities';
import { useCurrentEntityId } from '../useSelectedEntity/useSelectedEntity';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { isEqual } from 'lodash';

interface UseEntitiesProps {
  onlyAccountant?: boolean;
  notAccountant?: boolean;
}

interface UserEntitiesReturn {
  userEntities: Entity[];
  users: EntityUser[];
  error: Error | undefined;
  loading: boolean;
}
export const useUserEntities = (
  props?: UseEntitiesProps
): UserEntitiesReturn => {
  const onlyAccountant = props ? props.onlyAccountant : false;
  const notAccountant = props ? props.notAccountant : false;

  const { data: subData } = useQuery(gql(GET_SUB));
  const sub = subData?.sub;
  const currentEntityId = useCurrentEntityId();

  const [
    listEntityUsers,
    { data: entityUsersData, error: listEntitiesError, loading },
  ] = useLazyQuery(gql(LIST_ENTITY_USERS), {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

  const users = useMemo(() => {
    return entityUsersData?.entityUsersByUser?.items?.filter(
      (entityUser: EntityUser) =>
        (!onlyAccountant && !notAccountant) ||
        (onlyAccountant && entityUser?.role === EntityUserRole.ACCOUNTANT) ||
        (notAccountant && entityUser?.role !== EntityUserRole.ACCOUNTANT)
    );
  }, [entityUsersData, onlyAccountant]);

  const userEntities = useMemo(() => {
    return (
      users
        ?.map((users: EntityUser) => users.entity)
        .filter((entity: Entity) => entity !== null) || []
    );
  }, [users]);
  const client = useApolloClient();

  useLayoutEffect(() => {
    const listEntities = async () => {
      try {
        await listEntityUsers({
          variables: { limit: 50 },
        });
        // client.cache.updateQuery(
        //   { query: gql(LIST_ENTITY_USERS), variables: { limit: 50 } },
        //   (data) => {
        //     const clonedData = cloneDeep(data);
        //     const entityUser = clonedData?.entityUsersByUser?.items.find(
        //       (user: EntityUser) => user?.entity?.id === currentEntityId
        //     );
        //     const entity: Entity = entityUser?.entity;

        //     if (entity) {
        //       const paymentMethods = entity.paymentMethods?.items ?? [];

        //       // Sort paymentMethods by a certain condition
        //       paymentMethods.sort(
        //         (
        //           a: PaymentMethod | undefined | null,
        //           b: PaymentMethod | undefined | null
        //         ) => {
        //           // Replace 'order' with your condition for sorting

        //           if (!a || !b) return 0;
        //           if (
        //             a?.paymentMethodType !== PaymentMethodType.CARD ||
        //             b?.paymentMethodType !== PaymentMethodType.CARD
        //           )
        //             return 0;
        //           if (a.id === entity.paymentMethodId) return -1;
        //           else if (b.id === entity.paymentMethodId) return 1;
        //           return 0;
        //         }
        //       );
        //     }

        //     return clonedData;
        //   }
        // );
      } catch (err) {
        console.log('ERROR listing entities: ', err);
      }
    };
    if (sub?.sub) listEntities();
  }, [listEntityUsers, sub]);

  return { userEntities, users, error: listEntitiesError, loading };
};
