export const CSgetConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      title
      image {
        alt
        identityId
        key
        level
      }
      messages(sortDirection: DESC) {
        items {
          attachments {
            identityId
            key
            level
            type
          }
          conversationId
          text
          createdBy
          createdAt
          updatedAt
          id
          conversationMessagesId
          users
          readBy
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          userId
          user {
            identityId
            about
            firstName
            lastName
            profileImg {
              alt
              identityId
              key
              level
            }
            userType
            country
            interests
            locale
            createdAt
            updatedAt
            id
            owner
          }
          createdAt
          updatedAt
          id
          conversationUserConversationsId
        }
        nextToken
      }
      readBy
      users
      createdAt
      updatedAt
      id
    }
  }
`;
export const CSgetTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      title
      teamUsers {
        items {
          teamId
          userId
          user {
            identityId
            about
            firstName
            lastName
            profileImg {
              alt
              identityId
              key
              level
            }
            userType
            country
            interests
            billingId
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
        nextToken
      }
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const CSlistUserConversations = /* GraphQL */ `
  query ListUserConversations(
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        conversationId
        conversation {
          title
          readBy
          users
          userConversations {
            items {
              conversationId
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
            nextToken
          }
          createdAt
          updatedAt
          id
          messages(sortDirection: DESC) {
            items {
              attachments {
                identityId
                key
                level
                type
              }
              conversationId
              text
              createdBy
              createdAt
              updatedAt
              id
              conversationMessagesId
              users
              readBy
            }
            nextToken
          }
          userConversations {
            items {
              conversationId
              userId
              users
              createdAt
              updatedAt
              id
              conversationUserConversationsId
            }
            nextToken
          }
        }
        userId
        user {
          identityId
          about
          firstName
          lastName
          profileImg {
            alt
            identityId
            key
            level
          }
          country
          interests
          locale
          createdAt
          updatedAt
          id
          owner
        }
        createdAt
        updatedAt
        id
        conversationUserConversationsId
      }
      nextToken
    }
  }
`;
export const CSgetUserOther = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const CSIsLoggedIn = `
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;
export const CSGetSub = `
  query GetSub {
    sub @client
  }
`;

export const CSGetSelectedEntityId = `
  query GetSelectedEntityId {
    selectedEntityId @client
  }
`;

export const CSGetUserType = `
  query GetUserType {
    userType @client
  }
`;

export const CSIsToDoHidden = `
  query isToDoHidden {
    hideToDo @client
  }
`;

export const CSGetUnreadChat = `
  query GetUnreadChat {
    unreadChat @client
  }
`;
