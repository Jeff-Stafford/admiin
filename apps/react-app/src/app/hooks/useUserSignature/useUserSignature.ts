import { useMemo } from 'react';
import { getFromS3Storage } from '@admiin-com/ds-amplify';
import { gql, useQuery } from '@apollo/client';
import {
  CSGetSub as GET_SUB,
  getUser as GET_USER,
} from '@admiin-com/ds-graphql';

interface UseUserSignatureReturn {
  userSignatureKey: string;
  getSignatureBlob: (signatureKey?: string) => Promise<Blob>;
}

export const useUserSignature = (): UseUserSignatureReturn => {
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { data: userData } = useQuery(gql(GET_USER), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });
  const userSignatureKey = useMemo(() => {
    return userData?.getUser?.signatures?.items[0]?.key || '';
  }, [userData]);

  const getSignatureBlob = async (signatureKey = userSignatureKey) => {
    const urlBlob = await getFromS3Storage(
      signatureKey,
      null,
      'private',
      false,
      true
    );
    console.log('urlBlob: ', urlBlob);
    return urlBlob.Body as Blob;
  };

  return { getSignatureBlob, userSignatureKey };
};
