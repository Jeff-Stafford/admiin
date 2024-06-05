import {
  createContact as CREATE_CONTACT,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  contactsByEntity as CONTACTS_BY_ENTITY,
  // Contact,
  // ContactStatus,
  // ContactType,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  MutationTuple,
  OperationVariables,
  DefaultContext,
  ApolloCache,
} from '@apollo/client';
import { GET_CONTACTS_AND_VERIFIED_ENTITY } from '../../components/AutoCompleteLookup/useLookupService';

export type UseMutationTuple = MutationTuple<
  any,
  OperationVariables,
  DefaultContext,
  ApolloCache<any>
>;
// interface ContactsByEntityData {
//   contactsByEntity: {
//     items: Contact[];
//   };
// }

export function useCreateContact(): [
  UseMutationTuple[0],
  { error: UseMutationTuple[1]['error'] }
] {
  // const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  // // const entityId = selectedEntityIdData?.selectedEntityId;

  const [createContact, { error }] = useMutation(gql(CREATE_CONTACT), {
    update(cache, { data: { createContact } }) {
      cache.modify({
        fields: {
          contactsByEntity(existingContactsByEntity = { items: [] }) {
            const dataRef = cache.writeFragment({
              data: createContact,
              fragment: gql`
                fragment NewContact on Contact {
                  id
                  entityId
                  firstName
                  lastName
                  email
                  phone
                  companyName
                  searchName
                  status
                  createdAt
                  updatedAt
                  contactType
                  owner
                }
              `,
            });
            return {
              ...existingContactsByEntity,
              items: existingContactsByEntity.items.concat(dataRef),
            };
          },
        },
      });
    },
    // refetchQueries: [
    //   gql(CONTACTS_BY_ENTITY),
    //   gql(GET_CONTACTS_AND_VERIFIED_ENTITY),
    // ],
  });

  return [createContact, { error }];
}
