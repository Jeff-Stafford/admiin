import { Auth, Cache, Storage } from 'aws-amplify';
export type S3Level = 'public' | 'protected' | 'private';

/**
 * Upload to S3 Storage
 *
 * @param reqParams
 * @param progressCallback
 * @param level
 * @returns {Promise<Object>}
 */
export const uploadToS3Storage: (
  {
    key,
    contentType,
    file,
    level,
  }: {
    key: string;
    contentType: string;
    file: File | Blob;
    level: S3Level;
  },
  progressCallback: (data: ProgressEvent) => void
) => Promise<any> = async (
  {
    key,
    contentType,
    file,
    level = 'protected',
  }: { key: string; contentType: string; file: File | Blob; level: S3Level },
  progressCallback: (data: ProgressEvent) => void
): Promise<object> => {
  return Storage.put(key, file, {
    contentType,
    progressCallback,
    level,
  });
};

/**
 * Get from S3 Storage and cache presigned url
 * @param key
 * @param identityId
 * @param level
 * @param byPassCache
 * @param download
 * @returns {Promise<String|Object|any>}
 */
export const getFromS3Storage = async (
  key: string,
  identityId: string | null = null,
  level: S3Level = 'protected',
  byPassCache = false,
  download = false
): Promise<string | object | any> => {
  let cachedUrl;

  if (!byPassCache && Cache && !download) {
    try {
      cachedUrl = await Cache.getItem(key);
    } catch (err) {
      console.log('get cache url error: ', err);
    }

    // return cached url if it exists
    if (cachedUrl) {
      return cachedUrl;
    }
  }

  const currentSession = await Auth.currentSession();
  const sessionExpiry = currentSession.getIdToken()?.payload?.exp; // unix timestamp in seconds
  const timeStampNowSeconds = parseInt(String(+new Date() / 1000)); // get now unix timestamp in seconds

  const expireUnixSeconds = sessionExpiry - timeStampNowSeconds; // get seconds from now to expire

  const options: {
    expires: number;
    level: S3Level;
    identityId?: string;
    download?: boolean;
  } = {
    expires: expireUnixSeconds, // expiry UNIX timestamp in seconds
    level,
  };

  if (identityId) {
    options.identityId = identityId;
  }

  if (download) {
    options.download = download;
  }

  const url = await Storage.get(key, options);
  if (Cache && !download) {
    try {
      await Cache.setItem(key, url, { expires: sessionExpiry * 1000 }); // unix timestamp in milliseconds
    } catch (err) {
      console.log('error set image cache: ', err);
    }
  }

  return url;
};

/**
 * Delete from S3 Storage
 *
 * @returns {Promise<any>}
 * @param key
 */
export const deleteFromS3Storage = async (key: string) => {
  return Storage.remove(key);
};

//import { createS3PresignedUrl } from '../graphql/mutations';
// export async function generatePreSignedURL(key, contentType) {
//   const preSignedPayload = {
//     reqParams: {
//       input: {
//         key: `public/${ key }`,
//         contentType
//       }
//     },
//     mutationToExecute: createS3PresignedUrl
//   };
//
//   console.log('preSignedPayload', preSignedPayload);
//
//   const url = await mutationService(preSignedPayload);
//   return JSON.parse(url.data.createS3PresignedUrl);
// }
