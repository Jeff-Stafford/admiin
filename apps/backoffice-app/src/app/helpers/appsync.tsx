import { AuthOptions } from 'aws-appsync-auth-link';
import cdkOutput from '../output.json';
import { Auth } from 'aws-amplify';
import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { isLoggedInVar, subInVar, userTypeInVar } from '@admiin-com/ds-graphql';
import { typeDefs } from '@admiin-com/ds-graphql';

/**
 * Configure AppSync client
 */

const httpLink = new HttpLink({
  uri: cdkOutput.ADMAppSyncAPIStack.GraphQLAPIURL,
});

export const configureAppSyncClient = () => {
  const url = cdkOutput.ADMAppSyncAPIStack.GraphQLAPIURL; // TODO: duplicated url?
  const region = 'us-east-1';
  const auth: AuthOptions = {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
    //apiKey: awsmobile.aws_appsync_apiKey, // required when using api key to call api
    //credentials: async () => credentials, // Required when using IAM-based auth.
  };

  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
    //createHttpLink({
    //  uri: awsmobile.aws_appsync_graphqlEndpoint,
    //}),
  ]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read() {
                return isLoggedInVar();
              },
            },
            sub: {
              read() {
                return subInVar();
              },
            },
            userType: {
              read() {
                return userTypeInVar();
              },
            },
            listUserConversations: {
              merge: true,
            },
            messagesByConversation: {
              merge: true,
            },
          },
        },
        User: {
          fields: {
            profileImg: {
              merge: true,
            },
          },
        },
        //ModelUserConversationConnection: {
        //  merge: true,
        //},
        //listUserConversations: {
        //  merge: true,
        //},
        //UserConversation: {
        //  merge: true,
        //},
      },
    }),
    connectToDevTools: true, //TODO: disable for production
    typeDefs: gql(typeDefs),
    //disableOffline: true,
  });
};
