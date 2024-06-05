import { Hub } from 'aws-amplify';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface HubListenerProps {}

export function HubListener(props: HubListenerProps) {
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('hub event: ', event, data);
      switch (event) {
        case 'signIn':
          //setUser(data);
          break;
        case 'signOut':
          //setUser(null);
          break;
        case 'customOAuthState':
        //setCustomState(data);
      }
    });

    //getUser();

    return unsubscribe;
  }, []);

  return null;
}

export default HubListener;
