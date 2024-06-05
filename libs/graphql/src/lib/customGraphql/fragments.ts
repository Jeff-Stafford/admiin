export const CSadminFragment = `
  fragment AdminParts on Admin {
    country
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
`;

export const CSmessageFragment = `
  fragment MessageParts on Message {
    conversationId
    text
    attachments {
      identityId
      key
      level
      type
    }
    users
    readBy
    createdBy
    createdAt
    updatedAt
    id
    conversationMessagesId
  }
`;

export const CSoptionFragment = `
  fragment OptionParts on Option {
    name
    label
    value
    group
    createdAt
    updatedAt
    id
  }
`;

export const CSProductFragment = `
  fragment ProductParts on Product {
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
`;

export const CSProjectFragment = `
  fragment ProjectParts on Project {
    title
    abbreviation
    status
    owner
    createdAt
    updatedAt
    completedAt
    id
  }
`;

export const CSTaskFragment = `
  fragment TaskParts on Task {
    title
    projectId
    status
    owner
    dateAt
    createdAt
    updatedAt
    completedAt
    id
  }
`;

export const CSTeamFragment = `
  fragment TeamUserParts on TeamUser {
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
      email
      about
      firstName
      lastName
      phone
      country
      profileImg {
        alt
        identityId
        key
        level
      }
      interests
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
    owner
  }
`;
