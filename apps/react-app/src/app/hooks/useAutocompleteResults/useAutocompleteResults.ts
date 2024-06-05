import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  autocompleteResultsByType as AUTOCOMPLETE_RESULTS_BY_TYPE,
  AutocompleteType,
} from '@admiin-com/ds-graphql';
import { useLayoutEffect, useMemo } from 'react';
import {
  CSGetSub as GET_SUB,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
} from '@admiin-com/ds-graphql';

interface useAutocompleteResultsProps {
  searchName?: string;
  type?: AutocompleteType;
}

export const useAutocompleteResults = ({
  searchName = '',
  type,
}: useAutocompleteResultsProps) => {
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const sub = subData?.sub;
  const entityId = selectedEntityIdData?.selectedEntityId;

  const [
    getAutocompleteResultsList,
    {
      data: autocompleteResultsData,
      error: searchAutocompleteResultsError,
      loading,
    },
  ] = useLazyQuery(gql(AUTOCOMPLETE_RESULTS_BY_TYPE), {
    variables: {
      type,
      searchName,
    },
    notifyOnNetworkStatusChange: true,
  });

  const autocompleteResults = useMemo(
    () => autocompleteResultsData?.autocompleteResultsByEntity?.items || [],
    [autocompleteResultsData]
  );

  useLayoutEffect(() => {
    const listFunc = async () => {
      try {
        await getAutocompleteResultsList();
      } catch (err) {
        console.log('ERROR listing entities: ', err);
      }
    };
    if (sub?.sub) listFunc();
  }, [getAutocompleteResultsList, sub, searchName]);

  return {
    autocompleteResults,
    getAutocompleteResults: getAutocompleteResultsList,
    error: searchAutocompleteResultsError,
    loading,
  };
};
