import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  contactsByEntity as CONTACT_BY_ENTITY,
  Contact,
  ContactStatus,
  ContactType,
} from '@admiin-com/ds-graphql';
import { useLayoutEffect, useMemo } from 'react';
import {
  CSGetSub as GET_SUB,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
} from '@admiin-com/ds-graphql';

interface useContactsProps {
  searchName?: string;
  contactType?: ContactType;
}

export const useContacts = ({
  searchName = '',
  contactType = ContactType.NORMAL,
}: useContactsProps) => {
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const sub = subData?.sub;
  const entityId = selectedEntityIdData?.selectedEntityId;

  const handleLoadMore = () => {
    const currentToken = contactsData?.contactsByEntity?.nextToken;

    if (currentToken) {
      fetchMore({
        variables: {
          nextToken: currentToken,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            ...fetchMoreResult,
            contactsByEntity: {
              ...fetchMoreResult.contactsByEntity,
              items: [
                ...prevResult.contactsByEntity.items,
                ...fetchMoreResult.contactsByEntity.items,
              ],
              nextToken: fetchMoreResult.contactsByEntity.nextToken, // Ensure the new token is updated
            },
          };
        },
      });
    }
  };
  const {
    data: contactsData,
    fetchMore,
    error: searchContactsError,
    loading,
  } = useQuery(gql(CONTACT_BY_ENTITY), {
    variables: {
      entityId,
      filter: {
        searchName: {
          contains: searchName,
        },
        type: { eq: contactType },
        status: { eq: ContactStatus.ACTIVE },
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const contacts: Contact[] = useMemo(
    () =>
      contactsData?.contactsByEntity?.items?.filter(
        (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
      ) || [],
    [contactsData]
  );

  const hasNextPage = contactsData?.contactsByEntity?.nextToken != null;
  return {
    contacts,
    error: searchContactsError,
    handleLoadMore, // Use this function to load more items
    loading,
    hasNextPage,
  };
};
