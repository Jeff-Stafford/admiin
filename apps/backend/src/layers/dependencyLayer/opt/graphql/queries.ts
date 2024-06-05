/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const abrLookup = /* GraphQL */ `
  query AbrLookup($abn: String) {
    abrLookup(abn: $abn) {
      abn
      abnStatus
      abnStatusEffectiveFrom
      acn
      addressDate
      addressPostcode
      addressState
      businessName
      entityName
      entityTypeCode
      entityTypeName
      gst
      message
    }
  }
`;
export const abrLookupByName = /* GraphQL */ `
  query AbrLookupByName($name: String) {
    abrLookupByName(name: $name) {
      items {
        abn
        abnStatus
        isCurrent
        name
        nameType
        postcode
        state
      }
    }
  }
`;
export const getAdmin = /* GraphQL */ `
  query GetAdmin($id: ID!) {
    getAdmin(id: $id) {
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
export const listAdmins = /* GraphQL */ `
  query ListAdmins(
    $filter: ModelAdminFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdmins(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const autocompleteResultsByType = /* GraphQL */ `
  query AutocompleteResultsByType(
    $type: AutocompleteType!
    $searchName: String!
    $sortDirection: ModelSortDirection
    $filter: ModelEntityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    autocompleteResultsByType(
      type: $type
      searchName: $searchName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        value
        label
        info
        type
        searchName
        metadata {
          subCategory
          payoutMethod
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAutoComplete = /* GraphQL */ `
  query GetAutoComplete($id: ID!) {
    getAutoComplete(id: $id) {
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
      contact {
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
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
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
export const contactsByEntity = /* GraphQL */ `
  query ContactsByEntity(
    $entityId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelContactFilterInput
    $nextToken: String
  ) {
    contactsByEntity(
      entityId: $entityId
      sortDirection: $sortDirection
      filter: $filter
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
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
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getEntity = /* GraphQL */ `
  query GetEntity($id: ID!) {
    getEntity(id: $id) {
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
export const entityUsersByUser = /* GraphQL */ `
  query EntityUsersByUser(
    $sortDirection: ModelSortDirection
    $filter: ModelEntityUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    entityUsersByUser(
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
export const entityUsersByEntityId = /* GraphQL */ `
  query EntityUsersByEntityId(
    $entityId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelEntityUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    entityUsersByEntityId(
      entityId: $entityId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
export const getBusinessLookup = /* GraphQL */ `
  query GetBusinessLookup($query: String) {
    getBusinessLookup(query: $query) {
      name
      legalNames
      businessNames
      mainNames
      tradingNames
      score
      state
      postalCode
      type
      abn
      acn
      isActive
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const messagesByConversation = /* GraphQL */ `
  query MessagesByConversation(
    $conversationId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByConversation(
      conversationId: $conversationId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const notificationsByUser = /* GraphQL */ `
  query NotificationsByUser(
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByUser(
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        message
        status
        createdAt
        updatedAt
        type
        owner
      }
      nextToken
    }
  }
`;
export const getOption = /* GraphQL */ `
  query GetOption($id: ID!) {
    getOption(id: $id) {
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
export const listOptions = /* GraphQL */ `
  query ListOptions(
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const optionsByName = /* GraphQL */ `
  query OptionsByName(
    $name: String!
    $label: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    optionsByName(
      name: $name
      label: $label
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const optionsByGroup = /* GraphQL */ `
  query OptionsByGroup(
    $group: String!
    $label: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    optionsByGroup(
      group: $group
      label: $label
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const getPaymentGuest = /* GraphQL */ `
  query GetPaymentGuest($id: ID!) {
    getPaymentGuest(id: $id) {
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
export const listRatingsByUser = /* GraphQL */ `
  query ListRatingsByUser(
    $userId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatingsByUser(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!, $entityId: ID!) {
    getTask(id: $id, entityId: $entityId) {
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
export const getTaskGuest = /* GraphQL */ `
  query GetTaskGuest($id: ID!, $entityId: ID!) {
    getTaskGuest(id: $id, entityId: $entityId) {
      id
      entityId
      amount
      annotations
      fromId
      fromEntity {
        id
        name
        createdAt
        updatedAt
      }
      from {
        id
        name
        createdAt
        updatedAt
      }
      fromContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      fromType
      toEntity {
        id
        name
        createdAt
        updatedAt
      }
      toContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      toId
      to {
        id
        name
        createdAt
        updatedAt
      }
      toType
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
      createdBy
      entityIdBy
      dueAt
      noteForOther
      direction
      paymentAt
      lodgementAt
      readAt
      paidAt
      completedAt
      owner
      createdAt
      updatedAt
    }
  }
`;
export const tasksByEntityFrom = /* GraphQL */ `
  query TasksByEntityFrom(
    $entityId: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityFrom(
      entityId: $entityId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityTo = /* GraphQL */ `
  query TasksByEntityTo(
    $entityId: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityTo(
      entityId: $entityId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityByIdContactId = /* GraphQL */ `
  query TasksByEntityByIdContactId(
    $entityIdBy: ID!
    $contactId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityByIdContactId(
      entityIdBy: $entityIdBy
      contactId: $contactId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityBy = /* GraphQL */ `
  query TasksByEntityBy(
    $entityIdBy: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityBy(
      entityIdBy: $entityIdBy
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const teamUsersByTeamIdAndCreatedAt = /* GraphQL */ `
  query TeamUsersByTeamIdAndCreatedAt(
    $teamId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTeamUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamUsersByTeamIdAndCreatedAt(
      teamId: $teamId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
  }
`;
export const teamUsersByUserIdAndCreatedAt = /* GraphQL */ `
  query TeamUsersByUserIdAndCreatedAt(
    $userId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTeamUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamUsersByUserIdAndCreatedAt(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
  }
`;
export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
      userId
      purchaseToken
      expiresAt
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        userId
        purchaseToken
        expiresAt
        createdAt
        updatedAt
        id
        owner
      }
      nextToken
    }
  }
`;
export const transactionsByUserIdAndCreatedAt = /* GraphQL */ `
  query TransactionsByUserIdAndCreatedAt(
    $userId: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    transactionsByUserIdAndCreatedAt(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        purchaseToken
        expiresAt
        createdAt
        updatedAt
        id
        owner
      }
      nextToken
    }
  }
`;
export const transactionsByPurchaseTokenAndCreatedAt = /* GraphQL */ `
  query TransactionsByPurchaseTokenAndCreatedAt(
    $purchaseToken: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    transactionsByPurchaseTokenAndCreatedAt(
      purchaseToken: $purchaseToken
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        purchaseToken
        expiresAt
        createdAt
        updatedAt
        id
        owner
      }
      nextToken
    }
  }
`;
export const getTranslation = /* GraphQL */ `
  query GetTranslation($language: String, $namespace: String) {
    getTranslation(language: $language, namespace: $namespace) {
      language
      namespace
      data
    }
  }
`;
export const listTranslations = /* GraphQL */ `
  query ListTranslations {
    listTranslations {
      language
      items {
        language
        namespace
        data
      }
    }
  }
`;
export const getUserConversation = /* GraphQL */ `
  query GetUserConversation($id: ID!) {
    getUserConversation(id: $id) {
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
export const listUserConversations = /* GraphQL */ `
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
                  nextToken
                }
                userConversations {
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
  }
`;
export const userConversationsByConversationIdAndCreatedAt = /* GraphQL */ `
  query UserConversationsByConversationIdAndCreatedAt(
    $conversationId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByConversationIdAndCreatedAt(
      conversationId: $conversationId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
                image {
                  alt
                  identityId
                  key
                  level
                  type
                }
                country
                messages {
                  nextToken
                }
                userConversations {
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
  }
`;
export const userConversationsByUserId = /* GraphQL */ `
  query UserConversationsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
                image {
                  alt
                  identityId
                  key
                  level
                  type
                }
                country
                messages {
                  nextToken
                }
                userConversations {
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
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const usersByTeamId = /* GraphQL */ `
  query UsersByTeamId(
    $teamId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByTeamId(
      teamId: $teamId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const xeroListContacts = /* GraphQL */ `
  query XeroListContacts($page: Int) {
    xeroListContacts(page: $page) {
      contactID
      contactNumber
      accountNumber
      contactStatus
      name
      firstName
      lastName
      companyNumber
      emailAddress
      bankAccountDetails
      taxNumber
      accountsReceivableTaxType
      accountsPayableTaxType
      addresses {
        addressType
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        city
        region
        postalCode
        country
        attentionTo
      }
      phones {
        phoneType
        phoneNumber
        phoneAreaCode
        phoneCountryCode
      }
      isSupplier
      isCustomer
      defaultCurrency
      updatedDateUTC
      contactPersons {
        firstName
        lastName
        emailAddress
        includeInEmails
      }
      hasAttachments
      xeroNetworkKey
      salesDefaultAccountCode
      purchasesDefaultAccountCode
      trackingCategoryName
      trackingCategoryOption
      paymentTerms
      website
      discount
    }
  }
`;
export const xeroListTransactions = /* GraphQL */ `
  query XeroListTransactions($statuses: [XeroInvoiceStatus], $page: Int) {
    xeroListTransactions(statuses: $statuses, page: $page) {
      invoiceID
      type
      status
      lineAmountTypes
      currencyCode
      date
      dueDate
      lineItems {
        lineItemID
        description
        quantity
        unitAmount
        itemCode
        accountCode
        accountID
        taxType
        taxAmount
        lineAmount
        taxNumber
        discountRate
        discountAmount
        repeatingInvoiceID
      }
      subTotal
      totalTax
      total
      invoiceNumber
      reference
      hasAttachments
      updatedDateUTC
      currencyRate
      remainingCredit
      amountDue
      amountPaid
      fullyPaidOnDate
      amountCredited
      brandingThemeID
      hasErrors
      contact {
        contactID
        contactNumber
        accountNumber
        contactStatus
        name
        firstName
        lastName
        companyNumber
        emailAddress
        bankAccountDetails
        taxNumber
        accountsReceivableTaxType
        accountsPayableTaxType
        addresses {
          addressType
          addressLine1
          addressLine2
          addressLine3
          addressLine4
          city
          region
          postalCode
          country
          attentionTo
        }
        phones {
          phoneType
          phoneNumber
          phoneAreaCode
          phoneCountryCode
        }
        isSupplier
        isCustomer
        defaultCurrency
        updatedDateUTC
        contactPersons {
          firstName
          lastName
          emailAddress
          includeInEmails
        }
        hasAttachments
        xeroNetworkKey
        salesDefaultAccountCode
        purchasesDefaultAccountCode
        trackingCategoryName
        trackingCategoryOption
        paymentTerms
        website
        discount
      }
    }
  }
`;
export const getPayToFailedPayment = /* GraphQL */ `
  query GetPayToFailedPayment($instructionId: String!) {
    getPayToFailedPayment(instructionId: $instructionId) {
      id
      agreementUuid
      errorMessage
    }
  }
`;
export const getEntityPayId = /* GraphQL */ `
  query GetEntityPayId($entityId: ID!, $billPayments: [BillsPaymentInput]) {
    getEntityPayId(entityId: $entityId, billPayments: $billPayments) {
      transferAmount
      payId
      payIdReference
      currency
    }
  }
`;
