import {
  AutocompleteResult,
  AutocompleteType,
  Task,
  autocompleteResultsByType,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { cloneContactWithSearchName } from '../../components/ContactDetail/ContactDetail';
import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { getName } from '../../helpers/contacts';

type useContactProps = Task | null;

export const GET_AUTO_COMPLETE = `
  query GetAutoComplete(
    $id: ID!
  ){
    getAutoComplete(id: $id){
      contact {
        id
        firstName
        lastName
        companyName
        searchName
        contactType
        entityId
        email
      }
      entity {
        id
        name
        legalName
        searchName
        logo {
          alt
          identityId
          type
        }
        gstRegistered
        verificationStatus
      }
    }
  }
`;

export const useTaskToName = () => {
  const [getAutoComplete] = useLazyQuery(gql(GET_AUTO_COMPLETE), {
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });
  const [getAutoCompletes] = useLazyQuery(gql(autocompleteResultsByType), {
    variables: {
      type: AutocompleteType.ENTITY,
      searchName: '',
    },
  });
  const getTaskToName = React.useCallback(
    async (
      id: string | null | undefined,
      inAutoCompletes: boolean | undefined = false
    ) => {
      if (id) {
        try {
          if (inAutoCompletes) {
            const { data: autoCompleteResultsData } = await getAutoCompletes();
            const autoCompleteResults =
              autoCompleteResultsData?.autocompleteResultsByType?.items ?? [];
            const autoCompleteResult = autoCompleteResults.find(
              (item: AutocompleteResult) => item.id === id
            );
            if (autoCompleteResult) return { data: autoCompleteResult };
          }

          const data = await getAutoComplete({
            variables: { id },
          });
          const contactData = data?.data;
          const contact =
            contactData?.getAutoComplete?.contact ||
            contactData?.getAutoComplete?.entity;
          return { data: contact, name: getName(contact) ?? '' };
        } catch (e: any) {
          console.error('Error reading cache:', e);
          throw new Error(e);
        }
      } else {
        return { name: '', data: null };
      }
    },
    []
  );
  return getTaskToName;
};
export const useContact = (task: useContactProps) => {
  const contactId = task?.contactId || task?.contactIdFrom || task?.contactIdTo;
  const client = useApolloClient();
  const { data: contactData, loading: contactLoading } = useQuery(
    gql(GET_AUTO_COMPLETE),
    {
      variables: {
        id: task?.contactId,
      },
      skip: !task || !contactId,
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        // Update the cache manually
        client.writeQuery({
          query: gql(GET_AUTO_COMPLETE),
          variables: { id: contactId },
          data,
        });
      },
    }
  );

  const contact = React.useMemo(() => {
    const contact =
      contactData?.getAutoComplete?.contact ||
      contactData?.getAutoComplete?.entity;

    return contactData?.getAutoComplete?.contact
      ? cloneContactWithSearchName(contact)
      : { ...contact, searchName: contact?.name };
  }, [contactData?.getAutoComplete]);

  return { contact, contactLoading };
};
