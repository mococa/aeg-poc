/* ---------- External ---------- */
import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { UsersRepository } from "../database";
import { Hashing } from "@aeg-poc/utils";

const sdk = new AegSDK();

export class UserSchema {
  /**
   * @description
   * Repository for the users schema.
   * This repository is used to interact with the database and perform CRUD operations.
   */
  repository: UsersRepository;

  /**
   * @description
   * GraphQL type definitions for the User schema.
   * This schema is used to define the structure of the data and the operations that can be performed on it.
   */
  typeDefs: DocumentNode;
  resolvers: {
    Query: Record<string, (...args) => Promise<Models.User | Models.User[]>>;
    Mutation: Record<string, (...args) => Promise<Models.User | Models.User[] | boolean>>;
    User: any;
  };

  constructor(repository: UsersRepository) {
    this.repository = repository;

    this.typeDefs = gql`
      ${Models.Post.typeDefs}
      ${Models.User.typeDefs}
      ${Models.Category.typeDefs}
      ${Models.Comment.typeDefs}

      extend type User {
        posts: [Post]
        comments: [Comment]
      }

      extend type Query {
        getUsers: [User]
        getUserById(id: ID!): User
        getUserByUsername(username: String!): User
        getUsersByIds(ids: [ID!]!): [User]
      }

      extend type Mutation {
        createUser(username: String!, password: String!): User
        updateUser(id: ID!, username: String!, password: String!): User
        deleteUser(id: ID!): Boolean
      }
    `;

    this.resolvers = {
      User: {
        posts: async (parent) => {
          const posts = await sdk.posts.findPostsByUserId(parent.id);
          return posts;
        },
        comments: async (parent) => {
          const comments = await sdk.comments.findCommentsByUserId(parent.userId);
          return comments;
        },
      },
      Query: {
        getUsersByIds: async (_, { ids }) => {
          const users = await this.repository.getUsersByIds(ids);
          return users;
        },
        getUsers: async () => {
          const users = await this.repository.getAllUsers();
          return users;
        },
        getUserById: async (_, { id }) => {
          const user = await this.repository.getUserById(id);
          if (!user) {
            throw new Error(`User with ID ${id} not found`);
          }
          return user;
        },
        getUserByUsername: async (_, { username }) => {
          const user = await this.repository.getUserByUsername(username);
          if (!user) {
            throw new Error(`User with username ${username} not found`);
          }
          return user;
        },
      },
      Mutation: {
        createUser: async (_, { username, password: unhashedPassword }) => {
          const password = Hashing.generate(unhashedPassword);
          const user = await this.repository.createUser({ username, password });

          return user;
        },
        updateUser: async (_, { id, username, password: unhashedPassword }) => {
          const password = Hashing.generate(unhashedPassword);
          const user = await this.repository.updateUser({ id, username, password });
          if (!user) {
            throw new Error(`User with ID ${id} not found`);
          }
          return user;
        },
        deleteUser: async (_, { id }) => {
          const result = await this.repository.deleteUser(id);
          if (!result) {
            throw new Error(`Failed to delete user with ID ${id}`);
          }

          return result;
        },
      },
    };
  }

  get schema() {
    return {
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
    };
  }
}
