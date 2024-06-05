import {
  updateContact as UPDATE_CONTACT,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  contactsByEntity as CONTACTS_BY_ENTITY,
  Contact,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  MutationTuple,
  OperationVariables,
  DefaultContext,
  ApolloCache,
} from '@apollo/client';

type UpdateContactMutationTuple = MutationTuple<
  any,
  OperationVariables,
  DefaultContext,
  ApolloCache<any>
>;
interface ContactsByEntityData {
  contactsByEntity: {
    items: Contact[];
  };
}

export function useUpdateContact(): [
  UpdateContactMutationTuple[0],
  { error: UpdateContactMutationTuple[1]['error'] }
] {
  const [updateContact, { error }] = useMutation(gql(UPDATE_CONTACT), {});

  return [updateContact, { error }];
}
