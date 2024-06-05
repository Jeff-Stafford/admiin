/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateBeneficialOwner = /* GraphQL */ `
  subscription OnUpdateBeneficialOwner(
    $beneficialOwnerId: ID!
    $entityId: ID!
  ) {
    onUpdateBeneficialOwner(
      beneficialOwnerId: $beneficialOwnerId
      entityId: $entityId
    ) {
      id
      firstName
      lastName
      name
      providerEntityId
      verificationStatus
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onCreateConversation(filter: $filter) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  email
                  about
                  firstName
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  teamId
                  userType
                  rating
                  reportReasons
                  zaiUserId
                  zaiUserWalletId
                  zaiNppCrn
                  ipAddress
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
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            email
            about
            firstName
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            teamId
            team {
              title
              teamUsers {
                items {
                  teamId
                  userId
                  createdAt
                  updatedAt
                  owners
                  id
                  teamTeamUsersId
                }
                nextToken
              }
              ownerUserId
              createdAt
              updatedAt
              id
              owner
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            zaiUserId
            zaiUserWalletId
            zaiNppCrn
            ipAddress
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
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const onUpdateEntity = /* GraphQL */ `
  subscription OnUpdateEntity($entityId: ID!) {
    onUpdateEntity(entityId: $entityId) {
      id
      type
      taxNumber
      billerCode
      name
      legalName
      searchName
      address {
        placeId
        contactName
        contactNumber
        address1
        unitNumber
        streetNumber
        streetName
        streetType
        city
        country
        countryCode
        state
        stateCode
        postalCode
      }
      logo {
        alt
        identityId
        key
        level
        type
      }
      entityBeneficialOwners {
        items {
          entityId
          beneficialOwnerId
          beneficialOwner {
            id
            firstName
            lastName
            name
            providerEntityId
            verificationStatus
            createdBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      entityUsers {
        items {
          id
          entityId
          userId
          firstName
          lastName
          role
          entitySearchName
          entity {
            id
            type
            taxNumber
            billerCode
            name
            legalName
            searchName
            address {
              placeId
              contactName
              contactNumber
              address1
              unitNumber
              streetNumber
              streetName
              streetType
              city
              country
              countryCode
              state
              stateCode
              postalCode
            }
            logo {
              alt
              identityId
              key
              level
              type
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                beneficialOwner {
                  id
                  firstName
                  lastName
                  name
                  providerEntityId
                  verificationStatus
                  createdBy
                  createdAt
                  updatedAt
                }
                createdAt
                updatedAt
                owner
              }
              nextToken
            }
            entityUsers {
              items {
                id
                entityId
                userId
                firstName
                lastName
                role
                entitySearchName
                entity {
                  id
                  type
                  taxNumber
                  billerCode
                  name
                  legalName
                  searchName
                  gstRegistered
                  zaiCompanyId
                  zaiBankAccountId
                  zaiDigitalWalletId
                  zaiBpayCrn
                  phone
                  paymentMethodId
                  disbursementMethodId
                  ubosCreated
                  numUbosCreated
                  payoutMethod
                  subCategory
                  clientsEnabled
                  ocrEmail
                  verificationStatus
                  createdAt
                  updatedAt
                  owner
                }
                searchName
                createdBy
                createdAt
                updatedAt
              }
              nextToken
            }
            gstRegistered
            zaiCompanyId
            zaiBankAccountId
            zaiDigitalWalletId
            zaiBpayCrn
            contact {
              firstName
              lastName
              email
              phone
            }
            phone
            paymentMethods {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            paymentMethodId
            disbursementMethodId
            receivingAccounts {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            ubosCreated
            numUbosCreated
            payoutMethod
            subCategory
            clientsEnabled
            ocrEmail
            verificationStatus
            createdAt
            updatedAt
            owner
          }
          searchName
          createdBy
          createdAt
          updatedAt
        }
        nextToken
      }
      gstRegistered
      zaiCompanyId
      zaiBankAccountId
      zaiDigitalWalletId
      zaiBpayCrn
      contact {
        firstName
        lastName
        email
        phone
      }
      phone
      paymentMethods {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      paymentMethodId
      disbursementMethodId
      receivingAccounts {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      ubosCreated
      numUbosCreated
      payoutMethod
      subCategory
      clientsEnabled
      ocrEmail
      verificationStatus
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateMessageForConversation = /* GraphQL */ `
  subscription OnCreateMessageForConversation($conversationId: ID!) {
    onCreateMessageForConversation(conversationId: $conversationId) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const onCreateNotification = /* GraphQL */ `
  subscription OnCreateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onCreateNotification(filter: $filter) {
      id
      title
      message
      status
      createdAt
      updatedAt
      type
      owner
    }
  }
`;
export const onCreateUserConversationForUser = /* GraphQL */ `
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
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
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
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              email
              about
              firstName
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              zaiUserId
              zaiUserWalletId
              zaiNppCrn
              ipAddress
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
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        email
        about
        firstName
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        teamId
        team {
          title
          teamUsers {
            items {
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userId
              user {
                id
                identityId
                email
                about
                firstName
                lastName
                phone
                blocked
                blockedBy
                country
                profileImg {
                  alt
                  identityId
                  key
                  level
                  type
                }
                interests
                locale
                onboardingStatus
                onboardingEntity
                selectedSignatureKey
                signatures {
                  nextToken
                }
                teamId
                team {
                  title
                  ownerUserId
                  createdAt
                  updatedAt
                  id
                  owner
                }
                userType
                rating
                reportReasons
                notificationPreferences {
                  email
                  push
                  sms
                }
                zaiUserId
                zaiUserWalletId
                zaiNppCrn
                ipAddress
                createdAt
                updatedAt
                owner
              }
              createdAt
              updatedAt
              owners
              id
              teamTeamUsersId
            }
            nextToken
          }
          ownerUserId
          createdAt
          updatedAt
          id
          owner
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        zaiUserId
        zaiUserWalletId
        zaiNppCrn
        ipAddress
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
export const onCreateMessageForSenderUser = /* GraphQL */ `
  subscription OnCreateMessageForSenderUser($sender: String!) {
    onCreateMessageForSenderUser(sender: $sender) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const onCreateMessageForReceiverUser = /* GraphQL */ `
  subscription OnCreateMessageForReceiverUser($receiver: String!) {
    onCreateMessageForReceiverUser(receiver: $receiver) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onUpdateConversation(filter: $filter) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  email
                  about
                  firstName
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  teamId
                  userType
                  rating
                  reportReasons
                  zaiUserId
                  zaiUserWalletId
                  zaiNppCrn
                  ipAddress
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
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            email
            about
            firstName
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            teamId
            team {
              title
              teamUsers {
                items {
                  teamId
                  userId
                  createdAt
                  updatedAt
                  owners
                  id
                  teamTeamUsersId
                }
                nextToken
              }
              ownerUserId
              createdAt
              updatedAt
              id
              owner
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            zaiUserId
            zaiUserWalletId
            zaiNppCrn
            ipAddress
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
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onDeleteConversation(filter: $filter) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  email
                  about
                  firstName
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  teamId
                  userType
                  rating
                  reportReasons
                  zaiUserId
                  zaiUserWalletId
                  zaiNppCrn
                  ipAddress
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
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            email
            about
            firstName
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            teamId
            team {
              title
              teamUsers {
                items {
                  teamId
                  userId
                  createdAt
                  updatedAt
                  owners
                  id
                  teamTeamUsersId
                }
                nextToken
              }
              ownerUserId
              createdAt
              updatedAt
              id
              owner
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            zaiUserId
            zaiUserWalletId
            zaiNppCrn
            ipAddress
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
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const onCreateUserConversation = /* GraphQL */ `
  subscription OnCreateUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onCreateUserConversation(filter: $filter) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
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
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              email
              about
              firstName
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              zaiUserId
              zaiUserWalletId
              zaiNppCrn
              ipAddress
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
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        email
        about
        firstName
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        teamId
        team {
          title
          teamUsers {
            items {
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userId
              user {
                id
                identityId
                email
                about
                firstName
                lastName
                phone
                blocked
                blockedBy
                country
                profileImg {
                  alt
                  identityId
                  key
                  level
                  type
                }
                interests
                locale
                onboardingStatus
                onboardingEntity
                selectedSignatureKey
                signatures {
                  nextToken
                }
                teamId
                team {
                  title
                  ownerUserId
                  createdAt
                  updatedAt
                  id
                  owner
                }
                userType
                rating
                reportReasons
                notificationPreferences {
                  email
                  push
                  sms
                }
                zaiUserId
                zaiUserWalletId
                zaiNppCrn
                ipAddress
                createdAt
                updatedAt
                owner
              }
              createdAt
              updatedAt
              owners
              id
              teamTeamUsersId
            }
            nextToken
          }
          ownerUserId
          createdAt
          updatedAt
          id
          owner
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        zaiUserId
        zaiUserWalletId
        zaiNppCrn
        ipAddress
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
export const onUpdateUserConversation = /* GraphQL */ `
  subscription OnUpdateUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onUpdateUserConversation(filter: $filter) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
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
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              email
              about
              firstName
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              zaiUserId
              zaiUserWalletId
              zaiNppCrn
              ipAddress
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
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        email
        about
        firstName
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        teamId
        team {
          title
          teamUsers {
            items {
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userId
              user {
                id
                identityId
                email
                about
                firstName
                lastName
                phone
                blocked
                blockedBy
                country
                profileImg {
                  alt
                  identityId
                  key
                  level
                  type
                }
                interests
                locale
                onboardingStatus
                onboardingEntity
                selectedSignatureKey
                signatures {
                  nextToken
                }
                teamId
                team {
                  title
                  ownerUserId
                  createdAt
                  updatedAt
                  id
                  owner
                }
                userType
                rating
                reportReasons
                notificationPreferences {
                  email
                  push
                  sms
                }
                zaiUserId
                zaiUserWalletId
                zaiNppCrn
                ipAddress
                createdAt
                updatedAt
                owner
              }
              createdAt
              updatedAt
              owners
              id
              teamTeamUsersId
            }
            nextToken
          }
          ownerUserId
          createdAt
          updatedAt
          id
          owner
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        zaiUserId
        zaiUserWalletId
        zaiNppCrn
        ipAddress
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
export const onDeleteUserConversation = /* GraphQL */ `
  subscription OnDeleteUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onDeleteUserConversation(filter: $filter) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
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
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              email
              about
              firstName
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              zaiUserId
              zaiUserWalletId
              zaiNppCrn
              ipAddress
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
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        email
        about
        firstName
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        teamId
        team {
          title
          teamUsers {
            items {
              teamId
              team {
                title
                teamUsers {
                  nextToken
                }
                ownerUserId
                createdAt
                updatedAt
                id
                owner
              }
              userId
              user {
                id
                identityId
                email
                about
                firstName
                lastName
                phone
                blocked
                blockedBy
                country
                profileImg {
                  alt
                  identityId
                  key
                  level
                  type
                }
                interests
                locale
                onboardingStatus
                onboardingEntity
                selectedSignatureKey
                signatures {
                  nextToken
                }
                teamId
                team {
                  title
                  ownerUserId
                  createdAt
                  updatedAt
                  id
                  owner
                }
                userType
                rating
                reportReasons
                notificationPreferences {
                  email
                  push
                  sms
                }
                zaiUserId
                zaiUserWalletId
                zaiNppCrn
                ipAddress
                createdAt
                updatedAt
                owner
              }
              createdAt
              updatedAt
              owners
              id
              teamTeamUsersId
            }
            nextToken
          }
          ownerUserId
          createdAt
          updatedAt
          id
          owner
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        zaiUserId
        zaiUserWalletId
        zaiNppCrn
        ipAddress
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
