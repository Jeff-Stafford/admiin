import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';

import { gql, useQuery } from '@apollo/client';
import { useUserEntities } from '../useUserEntities/useUserEntities';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
export const useSelectedEntity = () => {
  const { userEntities: entities, loading } = useUserEntities();
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const entity = entities?.find((entity) => entity.id === entityId);

  return { entity, loading };
};
export const useCurrentEntityId = () => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  return entityId;
};
