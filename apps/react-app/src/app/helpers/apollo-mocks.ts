// apollo-mocks.ts
import { gql } from '@apollo/client';
import {
  XeroScopeSet,
  createPaymentMethodToken,
  getContact,
  getUser,
  optionsByGroup,
  xeroCreateTokenSet,
  xeroListTransactions,
} from '@admiin-com/ds-graphql';
import { MockedResponse } from '@apollo/client/testing';

export const initialMocks: MockedResponse[] = [
  {
    request: {
      query: gql`
        ${xeroListTransactions}
      `,
      variables: {
        page: 1,
        statuses: [],
      },
    },
    result: { data: { xeroListTransactions: null } },
  },
  {
    request: {
      query: gql`
        ${getContact}
      `,
      variables: { id: 'abc' },
    },
    result: {
      data: {
        getContact: { id: 'abc', entityId: 'abd', __typename: 'Contact' },
      },
    },
  },
  {
    delay: 30,
    request: {
      query: gql`
        ${createPaymentMethodToken}
      `,
      variables: { input: { tokenType: 'card', isGuest: false } },
    },
    result: {
      data: {
        createPaymentMethodToken: {
          token: '213',
          userId: 'asdasdasd',
          __typename: 'CreatePaymentMethodToken',
        },
      },
    },
  },
  {
    request: {
      query: gql`
        ${getUser}
      `,
      variables: {
        id: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
      },
    },
    result: {
      data: {
        id: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
        identityId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
        email: 'user123@example.com',
        about: 'This is a test user',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        blocked: ['user456'],
        blockedBy: null,
        country: 'United States',
        profileImg: {
          __typename: 'Image',
          alt: 'user profile image',
          identityId: 'imageIdentity123',
          key: 'imageKey123',
          level: null,
          type: 'jpeg',
        },
        interests: ['coding', 'AI', 'reading'],
        locale: 'en_US',
        billingId: 'billing123',
        billing: {
          __typename: 'Billing',
          userId: 'user123',
          planId: 'plan123',
          productId: 'product123',
          autoRenewProductId: 'autoRenewProduct123',
          subscriptionId: 'subscription123',
          status: null,
          teamId: 'team123',
          trialUsed: false,
          paymentProvider: null,
          purchaseToken: 'purchaseToken123',
          plan: null,
          expiresAt: '2024-12-22',
          cancelledAt: null,
          createdAt: '2023-12-22',
          updatedAt: '2023-12-22',
          id: 'billing123',
          owner: 'user123',
        },
        onboardingStatus: null,
        teamId: 'team123',
        team: {
          __typename: 'Team',
          title: 'Test Team',
          ownerUserId: 'user123',
          createdAt: '2023-12-22',
          updatedAt: '2023-12-22',
          id: 'team123',
          owner: 'user123',
        },
        userType: null,
        rating: 4.7,
        reportReasons: null,
        notificationPreferences: {
          __typename: 'NotificationPreferences',
          email: true,
          push: false,
          sms: true,
        },
        createdAt: '2023-12-22',
        updatedAt: '2023-12-22',
        owner: 'user123',
      },
    },
  },
  {
    request: {
      query: gql`
        ${xeroCreateTokenSet}
      `,
      variables: {
        input: {
          url: 'http://localhost:3000/',
          scopeSet: XeroScopeSet.ACCOUNTING,
        },
      },
    },
    result: { data: { xeroCreateTokenSet: {} } },
  },
  {
    request: {
      query: gql`
        ${optionsByGroup}
      `,
      variables: {
        group: 'Interests',
      },
    },
    result: { data: { optionsByGroup: { nextToken: 'abc', items: [] } } },
  },
];
