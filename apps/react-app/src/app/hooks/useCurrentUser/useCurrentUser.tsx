import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { CSGetSub as GET_SUB, getUser } from '@admiin-com/ds-graphql';

export function useCurrentUser() {
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });
  const user = useMemo(() => userData?.getUser || {}, [userData]);

  return user;
}
