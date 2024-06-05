/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAdmin = /* GraphQL */ `
  mutation CreateAdmin($input: CreateAdminInput) {
    createAdmin(input: $input) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const updateAdmin = /* GraphQL */ `
  mutation UpdateAdmin(
    $input: UpdateAdminInput!
    $condition: ModelAdminConditionInput
  ) {
    updateAdmin(input: $input, condition: $condition) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const deleteAdmin = /* GraphQL */ `
  mutation DeleteAdmin($input: DeleteAdminInput) {
    deleteAdmin(input: $input) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const updateBeneficialOwner = /* GraphQL */ `
  mutation UpdateBeneficialOwner($input: UpdateBeneficialOwnerInput) {
    updateBeneficialOwner(input: $input) {
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
export const createClient = /* GraphQL */ `
  mutation CreateClient($input: CreateClientInput) {
    createClient(input: $input) {
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
      searchName
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createContact = /* GraphQL */ `
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      entityId
      firstName
      lastName
      email
      phone
      taxNumber
      name
      legalName
      companyName
      searchName
      status
      createdAt
      updatedAt
      contactType
      bank {
        id
        accountName
        bankName
        accountNumber
        routingNumber
        holderType
        accountType
      }
      payoutMethod
      bpay {
        billerCode
        referenceNumber
      }
      owner
    }
  }
`;
export const createContactBulkUpload = /* GraphQL */ `
  mutation CreateContactBulkUpload($input: CreateContactBulkImportInput!) {
    createContactBulkUpload(input: $input)
  }
`;
export const updateContact = /* GraphQL */ `
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      entityId
      firstName
      lastName
      email
      phone
      taxNumber
      name
      legalName
      companyName
      searchName
      status
      createdAt
      updatedAt
      contactType
      bank {
        id
        accountName
        bankName
        accountNumber
        routingNumber
        holderType
        accountType
      }
      payoutMethod
      bpay {
        billerCode
        referenceNumber
      }
      owner
    }
  }
`;
export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
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
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
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
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
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
export const createEntity = /* GraphQL */ `
  mutation CreateEntity($input: CreateEntityInput!) {
    createEntity(input: $input) {
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
export const updateEntity = /* GraphQL */ `
  mutation UpdateEntity($input: UpdateEntityInput!) {
    updateEntity(input: $input) {
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
export const deleteEntity = /* GraphQL */ `
  mutation DeleteEntity(
    $input: DeleteEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    deleteEntity(input: $input, condition: $condition) {
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
export const createEntityUser = /* GraphQL */ `
  mutation CreateEntityUser($input: CreateEntityUserInput!) {
    createEntityUser(input: $input) {
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
      searchName
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const deleteEntityUser = /* GraphQL */ `
  mutation DeleteEntityUser($input: DeleteEntityUserInput) {
    deleteEntityUser(input: $input) {
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
      searchName
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createVerificationToken = /* GraphQL */ `
  mutation CreateVerificationToken($input: CreateVerificationTokenInput) {
    createVerificationToken(input: $input) {
      token
    }
  }
`;
export const lookupEntityOwnership = /* GraphQL */ `
  mutation LookupEntityOwnership($input: LookupEntityOwnershipInput) {
    lookupEntityOwnership(input: $input) {
      async
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const createNotification = /* GraphQL */ `
  mutation CreateNotification($input: CreateNotificationInput) {
    createNotification(input: $input) {
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
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification($input: UpdateNotificationInput) {
    updateNotification(input: $input) {
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
export const createOption = /* GraphQL */ `
  mutation CreateOption(
    $input: CreateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    createOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const updateOption = /* GraphQL */ `
  mutation UpdateOption(
    $input: UpdateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    updateOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const deleteOption = /* GraphQL */ `
  mutation DeleteOption(
    $input: DeleteOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    deleteOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const confirmPayments = /* GraphQL */ `
  mutation ConfirmPayments($input: ConfirmPaymentInput) {
    confirmPayments(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      zaiUpdatedAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPayment = /* GraphQL */ `
  mutation CreatePayment($input: CreatePaymentInput) {
    createPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      zaiUpdatedAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPaymentPayId = /* GraphQL */ `
  mutation CreatePaymentPayId($input: CreatePaymentPayIdInput) {
    createPaymentPayId(input: $input) {
      id
      entityId
      amount
      paymentType
      status
      taskPayments {
        id
        paymentType
        installments
        scheduledAt
      }
      scheduledAt
      createdBy
      zaiUserId
      receivedAt
      paidOutAt
      createdAt
      updatedAt
    }
  }
`;
export const cancelPaymentPayId = /* GraphQL */ `
  mutation CancelPaymentPayId($input: CancelPaymentPayIdInput) {
    cancelPaymentPayId(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      zaiUpdatedAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const retryPayment = /* GraphQL */ `
  mutation RetryPayment($input: RetryPaymentInput) {
    retryPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      zaiUpdatedAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createTaskPayment = /* GraphQL */ `
  mutation CreateTaskPayment($input: CreateTaskPaymentInput) {
    createTaskPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      zaiUpdatedAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPaymentGuest = /* GraphQL */ `
  mutation CreatePaymentGuest($input: CreatePaymentGuestInput) {
    createPaymentGuest(input: $input) {
      id
      entityId
      taskId
      amount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeId
      status
      payerUserStatus
      scheduledAt
      paidAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPaymentScheduledGuest = /* GraphQL */ `
  mutation CreatePaymentScheduledGuest(
    $input: CreatePaymentScheduledGuestInput
  ) {
    createPaymentScheduledGuest(input: $input) {
      id
      entityId
      taskId
      amount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeId
      status
      payerUserStatus
      scheduledAt
      paidAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPaymentMethod = /* GraphQL */ `
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput) {
    createPaymentMethod(input: $input) {
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
  }
`;
export const updatePaymentMethod = /* GraphQL */ `
  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput) {
    updatePaymentMethod(input: $input) {
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
  }
`;
export const createPushNotification = /* GraphQL */ `
  mutation CreatePushNotification($input: CreatePushNotificationInput) {
    createPushNotification(input: $input)
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating($input: UpdateRatingInput) {
    updateRating(input: $input) {
      id
      ratingBy
      owner
      name
      rating
      comment
      status
      createdAt
      updatedAt
    }
  }
`;
export const createSignature = /* GraphQL */ `
  mutation CreateSignature($input: CreateSignatureInput) {
    createSignature(input: $input) {
      id
      userId
      key
      createdAt
      updatedAt
    }
  }
`;
export const deleteSignature = /* GraphQL */ `
  mutation DeleteSignature($input: DeleteSignatureInput) {
    deleteSignature(input: $input) {
      id
      userId
      key
      createdAt
      updatedAt
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput) {
    createTask(input: $input) {
      entityId
      agreementUuid
      id
      activity {
        items {
          id
          compositeId
          userId
          entityId
          type
          message
          createdAt
          updatedAt
        }
        nextToken
      }
      amount
      annotations
      entityIdFrom
      fromId
      fromType
      toId
      toType
      entityIdTo
      contactIdFrom
      contactIdTo
      contactId
      fromSearchStatus
      toSearchStatus
      entityByIdContactId
      searchName
      status
      signatureStatus
      paymentStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      settlementStatus
      signers {
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
                  nextToken
                }
                entityUsers {
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
                  nextToken
                }
                paymentMethodId
                disbursementMethodId
                receivingAccounts {
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
        searchName
        createdBy
        createdAt
        updatedAt
      }
      payments {
        items {
          id
          taskId
          entityId
          payInPaymentId
          providerTransactionId
          paymentProvider
          disbursementId
          fromId
          fromType
          toId
          toType
          buyerId
          sellerId
          entityIdTo
          amount
          gstAmount
          installment
          installments
          feeAmount
          paymentType
          taxAmount
          currency
          feeIds
          ipAddress
          status
          payerUserStatus
          scheduledAt
          paidAt
          declinedAt
          createdAt
          receivedAt
          paidOutAt
          zaiUpdatedAt
          updatedAt
          voidedAt
          owner
        }
        nextToken
      }
      createdBy
      entityIdBy
      dueAt
      noteForSelf
      noteForOther
      direction
      readBy
      gstInclusive
      paymentAt
      lodgementAt
      createdAt
      updatedAt
      readAt
      paidAt
      completedAt
      owner
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask($input: UpdateTaskInput) {
    updateTask(input: $input) {
      entityId
      agreementUuid
      id
      activity {
        items {
          id
          compositeId
          userId
          entityId
          type
          message
          createdAt
          updatedAt
        }
        nextToken
      }
      amount
      annotations
      entityIdFrom
      fromId
      fromType
      toId
      toType
      entityIdTo
      contactIdFrom
      contactIdTo
      contactId
      fromSearchStatus
      toSearchStatus
      entityByIdContactId
      searchName
      status
      signatureStatus
      paymentStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      settlementStatus
      signers {
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
                  nextToken
                }
                entityUsers {
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
                  nextToken
                }
                paymentMethodId
                disbursementMethodId
                receivingAccounts {
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
        searchName
        createdBy
        createdAt
        updatedAt
      }
      payments {
        items {
          id
          taskId
          entityId
          payInPaymentId
          providerTransactionId
          paymentProvider
          disbursementId
          fromId
          fromType
          toId
          toType
          buyerId
          sellerId
          entityIdTo
          amount
          gstAmount
          installment
          installments
          feeAmount
          paymentType
          taxAmount
          currency
          feeIds
          ipAddress
          status
          payerUserStatus
          scheduledAt
          paidAt
          declinedAt
          createdAt
          receivedAt
          paidOutAt
          zaiUpdatedAt
          updatedAt
          voidedAt
          owner
        }
        nextToken
      }
      createdBy
      entityIdBy
      dueAt
      noteForSelf
      noteForOther
      direction
      readBy
      gstInclusive
      paymentAt
      lodgementAt
      createdAt
      updatedAt
      readAt
      paidAt
      completedAt
      owner
    }
  }
`;
export const updateTaskGuest = /* GraphQL */ `
  mutation UpdateTaskGuest($input: UpdateTaskGuestInput) {
    updateTaskGuest(input: $input) {
      entityId
      agreementUuid
      id
      activity {
        items {
          id
          compositeId
          userId
          entityId
          type
          message
          createdAt
          updatedAt
        }
        nextToken
      }
      amount
      annotations
      entityIdFrom
      fromId
      fromType
      toId
      toType
      entityIdTo
      contactIdFrom
      contactIdTo
      contactId
      fromSearchStatus
      toSearchStatus
      entityByIdContactId
      searchName
      status
      signatureStatus
      paymentStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      settlementStatus
      signers {
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
                  nextToken
                }
                entityUsers {
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
                  nextToken
                }
                paymentMethodId
                disbursementMethodId
                receivingAccounts {
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
        searchName
        createdBy
        createdAt
        updatedAt
      }
      payments {
        items {
          id
          taskId
          entityId
          payInPaymentId
          providerTransactionId
          paymentProvider
          disbursementId
          fromId
          fromType
          toId
          toType
          buyerId
          sellerId
          entityIdTo
          amount
          gstAmount
          installment
          installments
          feeAmount
          paymentType
          taxAmount
          currency
          feeIds
          ipAddress
          status
          payerUserStatus
          scheduledAt
          paidAt
          declinedAt
          createdAt
          receivedAt
          paidOutAt
          zaiUpdatedAt
          updatedAt
          voidedAt
          owner
        }
        nextToken
      }
      createdBy
      entityIdBy
      dueAt
      noteForSelf
      noteForOther
      direction
      readBy
      gstInclusive
      paymentAt
      lodgementAt
      createdAt
      updatedAt
      readAt
      paidAt
      completedAt
      owner
    }
  }
`;
export const createTaskDocumentUrl = /* GraphQL */ `
  mutation CreateTaskDocumentUrl($input: CreateTaskDocumentUrlInput) {
    createTaskDocumentUrl(input: $input) {
      url
      expiresAt
    }
  }
`;
export const createTaskDocumentUrlGuest = /* GraphQL */ `
  mutation CreateTaskDocumentUrlGuest($input: CreateTaskDocumentUrlInput) {
    createTaskDocumentUrlGuest(input: $input) {
      url
      expiresAt
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam($input: CreateTeamInput) {
    createTeam(input: $input) {
      title
      teamUsers {
        items {
          teamId
          team {
            title
            teamUsers {
              items {
                teamId
                team {
                  title
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
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
      title
      teamUsers {
        items {
          teamId
          team {
            title
            teamUsers {
              items {
                teamId
                team {
                  title
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
  }
`;
export const createTeamUser = /* GraphQL */ `
  mutation CreateTeamUser($input: CreateTeamUserInput) {
    createTeamUser(input: $input) {
      teamId
      team {
        title
        teamUsers {
          items {
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
      createdAt
      updatedAt
      owners
      id
      teamTeamUsersId
    }
  }
`;
export const deleteTeamUser = /* GraphQL */ `
  mutation DeleteTeamUser($input: DeleteTeamUserInput) {
    deleteTeamUser(input: $input) {
      teamId
      team {
        title
        teamUsers {
          items {
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
      createdAt
      updatedAt
      owners
      id
      teamTeamUsersId
    }
  }
`;
export const createTranslation = /* GraphQL */ `
  mutation CreateTranslation($input: CreateTranslationInput) {
    createTranslation(input: $input) {
      language
      namespace
      data
    }
  }
`;
export const updateTranslation = /* GraphQL */ `
  mutation UpdateTranslation($input: UpdateTranslationInput) {
    updateTranslation(input: $input) {
      language
      namespace
      data
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput) {
    updateUser(input: $input) {
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
  }
`;
export const blockUser = /* GraphQL */ `
  mutation BlockUser($input: BlockUserInput) {
    blockUser(input: $input) {
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
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount {
    deleteAccount {
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
  }
`;
export const createUserConversation = /* GraphQL */ `
  mutation CreateUserConversation(
    $input: CreateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    createUserConversation(input: $input, condition: $condition) {
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
export const updateUserConversation = /* GraphQL */ `
  mutation UpdateUserConversation(
    $input: UpdateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    updateUserConversation(input: $input, condition: $condition) {
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
export const deleteUserConversation = /* GraphQL */ `
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
export const publishUserMessage = /* GraphQL */ `
  mutation PublishUserMessage($userId: ID!) {
    publishUserMessage(userId: $userId) {
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
export const xeroCreateConsentUrl = /* GraphQL */ `
  mutation XeroCreateConsentUrl($input: XeroCreateConsentUrlInput) {
    xeroCreateConsentUrl(input: $input)
  }
`;
export const xeroCreateTokenSet = /* GraphQL */ `
  mutation XeroCreateTokenSet($input: XeroCreateTokenSetInput) {
    xeroCreateTokenSet(input: $input)
  }
`;
export const getUpdatePayToAgreement = /* GraphQL */ `
  mutation GetUpdatePayToAgreement($input: GetUpdatePayToAgreementInput!) {
    getUpdatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
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
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
export const createPaymentMethodToken = /* GraphQL */ `
  mutation CreatePaymentMethodToken($input: CreatePaymentMethodTokenInput) {
    createPaymentMethodToken(input: $input) {
      token
      userId
    }
  }
`;
export const createPayToAgreement = /* GraphQL */ `
  mutation CreatePayToAgreement($input: CreatePayToAgreementInput) {
    createPayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
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
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
export const validatePayToAgreement = /* GraphQL */ `
  mutation ValidatePayToAgreement($input: ValidatePayToAgreementInput) {
    validatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
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
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
