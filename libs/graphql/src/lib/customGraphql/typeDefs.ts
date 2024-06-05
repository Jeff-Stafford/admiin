export const typeDefs = `
  extend type Query {
    isLoggedIn: Boolean!
    sub: ID!
    selectedEntityId: ID
  }
`;
