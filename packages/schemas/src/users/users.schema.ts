/* ---------- External ---------- */
import { gql } from "graphql-tag";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Constants ---------- */
const sdk = new AegSDK();

/**
 * @description
 * Type definitions for the User service.
 * This schema defines the User type and the getUsers query.
 * The User type has three fields: id, name, and email.
 */
export const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  extend type Query {
    getUsers: [User]
  }
`;

/**
 * @description
 * Resolvers for the User service.
 * The getUsers query resolver fetches all users from the database.
 * The __resolveReference function is used to resolve references to the User type.
 */
export const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await sdk.users.findAllUsers();
      return users;
    },
  },
  User: {
    __resolveReference(ref) {
      return { id: ref.id, name: "Name", email: "email@example.com" };
    },
  },
};
