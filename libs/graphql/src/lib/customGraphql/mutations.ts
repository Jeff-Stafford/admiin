export const CScreateTeamUserItem = /* GraphQL */ `
  mutation CreateTeamUserItem($input: CreateTeamUserInput) {
    createTeamUserItem(input: $input) {
      teamId
      team {
        title
        teamUsers {
          nextToken
        }
        createdAt
        updatedAt
        id
        owner
      }
      userId
      user {
        id
        identityId
        about
        firstName
        lastName
        country
        profileImg {
          alt
          identityId
          key
          level
        }
        interests
        locale
        onboardingStatus
        teamId
        team {
          title
          createdAt
          updatedAt
          id
          owner
        }
        userType
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      id
      teamTeamUsersId
      owners
    }
  }
`;

export const CSdeleteTeamUser = /* GraphQL */ `
  mutation DeleteTeamUser(
    $input: DeleteTeamUserInput!
    $condition: ModelTeamUserConditionInput
  ) {
    deleteTeamUser(input: $input, condition: $condition) {
      teamId
      team {
        title
        teamUsers {
          nextToken
        }
        createdAt
        updatedAt
        id
        owner
      }
      userId
      user {
        identityId
        about
        firstName
        lastName
        country
        profileImg {
          alt
          identityId
          key
          level
        }
        interests
        locale
        billingId
        billing {
          customerId
          userId
          planId
          status
          paymentProvider
          expiresAt
          createdAt
          updatedAt
          id
          owner
        }
        teamId
        team {
          title
          createdAt
          updatedAt
          id
          owner
        }
        createdAt
        updatedAt
        id
        owner
      }
      createdAt
      updatedAt
      id
      teamTeamUsersId
      owners
    }
  }
`;

export const CSDeleteAccount = /* GraphQL */ `
  mutation DeleteAccount {
    deleteAccount {
      identityId
      about
      firstName
      lastName
      country
      profileImg {
        alt
        identityId
        key
        level
      }
      interests
      locale
      onboardingStatus
      userType
      createdAt
      updatedAt
      owner
    }
  }
`;

export const CSdeleteUserConversation = /* GraphQL */ `
  mutation DeleteUserConversation(
    $input: DeleteUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    deleteUserConversation(input: $input, condition: $condition) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
        }
        messages {
          nextToken
        }
        userConversations {
          nextToken
        }
        users
        readBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        about
        firstName
        lastName
        country
        profileImg {
          alt
          identityId
          key
          level
        }
        interests
        locale
        billingId
        onboardingStatus
        teamId
        team {
          title
          createdAt
          updatedAt
          id
          owner
        }
        userType
        createdAt
        updatedAt
        owner
      }
      users
      createdAt
      updatedAt
      id
      conversationUserConversationsId
    }
  }
`;
