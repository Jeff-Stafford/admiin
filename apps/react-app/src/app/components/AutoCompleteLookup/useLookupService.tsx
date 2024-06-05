import {
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  EntityUser,
  Entity,
  Contact,
  AutocompleteResult,
  ContactStatus,
  AutocompleteType,
} from '@admiin-com/ds-graphql';

import {
  autocompleteResultsByType as AUTOCOMPLETE_RESULTS_BY_TYPE,
  contactsByEntity as CONTACTS_BY_ENTITY,
  entityUsersByEntityId as LIST_ENTITY_USERS_BY_ENTITY,
  entityUsersByUser as LIST_ENTITIES_BY_USER,
} from '@admiin-com/ds-graphql';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React from 'react';
import { AutoCompleteDataType } from './AutoCompleteLookup';

export const GET_CONTACTS_AND_VERIFIED_ENTITY = /* GraphQL */ `
  query GetContactsAndVerifiedEntity(
    $entityId: ID!
    $type: AutocompleteType!
    $searchName: String!
    $sortDirectionContact: ModelSortDirection
    $sortDirectionAutoComplete: ModelSortDirection
    $filterContact: ModelContactFilterInput
    $filterAutoComplete: ModelEntityFilterInput
    $limitAutoComplete: Int
    $nextToken: String
  ) {
    contactsByEntity(
      entityId: $entityId
      sortDirection: $sortDirectionContact
      filter: $filterContact
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
    autocompleteResultsByType(
      type: $type
      searchName: $searchName
      sortDirection: $sortDirectionAutoComplete
      filter: $filterAutoComplete
      limit: $limitAutoComplete
      nextToken: $nextToken
    ) {
      items {
        id
        value
        label
        info
        type
        searchName
        metadata {
          subCategory
          payoutMethod
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

interface useLookupServiceProps {
  type: AutoCompleteDataType;
  entityId?: string;
}
export const useLookupService = ({
  type,
  entityId: entityIdProp,
}: useLookupServiceProps) => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const currentEntityId = selectedEntityIdData?.selectedEntityId;

  const entityId = entityIdProp ?? currentEntityId;

  const [getContacts, { loading: loadingContacts }] = useLazyQuery(
    gql(CONTACTS_BY_ENTITY)
  );
  const [getEntityUsers, { loading: loadingEntityUsers }] = useLazyQuery(
    gql(LIST_ENTITY_USERS_BY_ENTITY)
  );
  const [getEntities, { loading: loadingEntities }] = useLazyQuery(
    gql(LIST_ENTITIES_BY_USER)
  );

  // TODO: Add label for each item

  const [
    getContactsAndVerifiedEntity,
    { loading: loadingContactsAndVerifiedEntity },
  ] = useLazyQuery(gql(GET_CONTACTS_AND_VERIFIED_ENTITY));

  const [getAutocompleteResults, { loading: loadingAutocompleteResults }] =
    useLazyQuery(gql(AUTOCOMPLETE_RESULTS_BY_TYPE));

  const searchContactsAndVerifiedEntities = React.useCallback(
    async (value: string) => {
      const data = await getContactsAndVerifiedEntity({
        variables: {
          entityId,
          type: AutocompleteType.ENTITY,
          searchName: value.toLowerCase(),
          filterContact: {
            searchName: {
              contains: value.toLowerCase(),
            },
            status: {
              eq: ContactStatus.ACTIVE,
            },
          },
        },
      });
      return [
        ...(
          data?.data?.contactsByEntity?.items?.filter(
            (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
          ) ?? []
        ).map((item: Contact) => ({
          ...item,
          searchType: 'Contacts',
        })),
        ...(data?.data?.autocompleteResultsByType?.items ?? []).map(
          (item: AutocompleteResult) => ({
            ...item,
            searchType: 'AutoCompleteResults',
          })
        ),
      ];
    },
    [entityId, getContactsAndVerifiedEntity]
  );

  const searchContacts = React.useCallback(
    async (value: string) => {
      const data = await getContacts({
        variables: {
          entityId,
          filter: {
            searchName: {
              contains: value.toLowerCase(),
            },
            status: {
              eq: ContactStatus.ACTIVE,
            },
          },
        },
      });
      return (
        data?.data?.contactsByEntity?.items?.filter(
          (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
        ) ?? []
      );
    },
    [entityId, getContacts]
  );

  const searchEntityUsers = React.useCallback(
    async (value: string) => {
      const data = await getEntityUsers({
        variables: {
          entityId,
          filter: {
            searchName: {
              contains: value.toLowerCase(),
            },
          },
        },
      });
      return data?.data?.entityUsersByEntityId?.items ?? [];
    },
    [entityId, getEntityUsers]
  );

  const searchEntities = React.useCallback(
    async (value: string) => {
      const data = await getEntities({
        variables: {
          filter: {
            entitySearchName: {
              contains: value.toLowerCase(),
            },
          },
        },
      });
      return (
        data?.data?.entityUsersByUser?.items
          ?.map((entityUser: EntityUser) => entityUser.entity)
          .filter((entity: Entity) => entity !== null) || []
      );
    },
    [getEntities]
  );

  const searchAutocompleteResults = React.useCallback(
    async (value: string) => {
      const data = await getAutocompleteResults({
        variables: {
          type: AutocompleteType.ENTITY,
          searchName: value.toLowerCase(),
        },
      });
      return data?.data?.autocompleteResultsByType?.items ?? [];
    },
    [getAutocompleteResults]
  );

  if (type === 'Contact') {
    return { lookup: searchContacts, loading: loadingContacts };
  }
  if (type === 'ContactsAndVerifiedEntity') {
    return {
      lookup: searchContactsAndVerifiedEntities,
      loading: loadingContactsAndVerifiedEntity,
    };
  } else if (type === 'Entity') {
    return { lookup: searchEntities, loading: loadingEntities };
  } else if (type === 'EntityUser') {
    return { lookup: searchEntityUsers, loading: loadingEntityUsers };
  } else if (type === 'AutocompleteResults') {
    return {
      lookup: searchAutocompleteResults,
      loading: loadingAutocompleteResults,
    };
  }
  return { lookup: undefined, loading: false };
};
