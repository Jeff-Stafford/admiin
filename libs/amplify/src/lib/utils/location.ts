import { Auth, Cache, Geo } from 'aws-amplify';
/**
 * Get from S3 Storage and cache presigned url
 * @param key
 * @param identityId
 * @param level
 * @param byPassCache
 * @returns {Promise<String|Object|any>}
 */
export const getLocationById = async (
  placeId: string,
  byPassCache = false
): Promise<string | object | any> => {
  let cachedUrl;

  if (!byPassCache && Cache) {
    try {
      cachedUrl = await Cache.getItem(placeId);
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
  // const timeStampNowSeconds = parseInt(String(+new Date() / 1000)); // get now unix timestamp in seconds

  // const expireUnixSeconds = sessionExpiry - timeStampNowSeconds; // get seconds from now to expire

  // const options: { expires: number; level: S3Level; identityId?: string } = {
  //   expires: expireUnixSeconds, // expiry UNIX timestamp in seconds
  //   level,
  // };

  // if (identityId) {
  //   options.identityId = identityId;
  // }

  const suggestions = await Geo.searchByPlaceId(placeId);
  // console.log('Storage: ', Storage);
  if (Cache) {
    try {
      await Cache.setItem(placeId, suggestions, {
        expires: sessionExpiry * 1000,
      }); // unix timestamp in milliseconds
    } catch (err) {
      console.log('error set image cache: ', err);
    }
  }
  return suggestions;
};
export const getLocationSuggestion = async (
  searchText: string,
  byPassCache = false
) => {
  let cachedUrl;

  if (!byPassCache && Cache) {
    try {
      cachedUrl = await Cache.getItem(searchText);
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
  // const timeStampNowSeconds = parseInt(String(+new Date() / 1000)); // get now unix timestamp in seconds

  // const expireUnixSeconds = sessionExpiry - timeStampNowSeconds; // get seconds from now to expire

  // const options: { expires: number; level: S3Level; identityId?: string } = {
  //   expires: expireUnixSeconds, // expiry UNIX timestamp in seconds
  //   level,
  // };

  // if (identityId) {
  //   options.identityId = identityId;
  // }

  const suggestions = await Geo.searchForSuggestions(searchText, {
    countries: ['AUS'],
  });
  // console.log('Storage: ', Storage);
  if (Cache) {
    try {
      await Cache.setItem(searchText, suggestions, {
        expires: sessionExpiry * 1000,
      }); // unix timestamp in milliseconds
    } catch (err) {
      console.log('error set image cache: ', err);
    }
  }
  return suggestions;
};
