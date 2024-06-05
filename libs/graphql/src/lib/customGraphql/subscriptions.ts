export const CSonCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation($users: String) {
    onCreateConversation(users: $users) {
      title
      image {
        alt
        identityId
        key
        level
      }
      messages {
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
            onboardingStatus
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

export const CSonCreateUserConversationForUser = /* GraphQL */ `
  subscription OnCreateUserConversationForUser($userId: ID!) {
    onCreateUserConversationForUser(userId: $userId) {
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
              country
              profileImg {
                alt
                identityId
                key
                level
              }
              userType
              interests
              locale
              createdAt
              updatedAt
              id
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
        productId
        product {
          title
          category
          description
          images {
            alt
            identityId
            key
            level
          }
          tags
          country
          status
          owner
          createdAt
          updatedAt
          id
        }
        readBy
        users
        createdAt
        updatedAt
        id
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
        userType
        interests
        locale
        createdAt
        updatedAt
        id
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
