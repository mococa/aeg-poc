/* ---------- External ---------- */
import { gql } from "graphql-tag";

/* ---------- Database ---------- */
import { AegSDK } from "@aeg-poc/sdk";

const sdk = new AegSDK();

/**
 * @description
 * Type definitions for the Post service.
 * This schema defines the Post type and the getPosts query.
 * The Post type has three fields: id, title, and content.
 */
export const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
  }

  extend type Query {
    getPostById(id: ID!): Post
    getPostsByUserId(userId: ID!): [Post]
    getPostsByCategoryId(categoryId: ID!): [Post]
  }

  extend type Mutation {
    createPost(title: String!, content: String!, categoryId: ID!, userId: ID!): Post
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Boolean
  }
`;

/**
 * @description
 * Resolvers for the Post service.
 * The getPosts query resolver fetches all posts from the database.
 * The __resolveReference function is used to resolve references to the Post type.
 */
export const resolvers = {
  Query: {
    getPostById: async (_, { id }) => {
      const post = await sdk.posts.findPostById(id);
      return post;
    },
    getPostsByUserId: async (_, { userId }) => {
      const posts = await sdk.posts.findPostsByUserId(userId);
      return posts;
    },
    getPostsByCategoryId: async (_, { categoryId }) => {
      const posts = await sdk.posts.findPostsByCategoryId(categoryId);
      return posts;
    },
  },
  Mutation: {
    createPost: async (_, { title, content, categoryId, userId }) => {
      const post = await sdk.posts.createPost({ title, content, categoryId, userId });
      return post;
    },
    updatePost: async (_, { id, title, content }) => {
      const post = await sdk.posts.updatePost({ title, content, id });
      return post;
    },
    deletePost: async (_, { id }) => {
      await sdk.posts.deletePost(id);
      return true;
    },
  },
  Post: {
    __resolveReference(ref) {
      return { id: ref.id, title: "Title", content: "Content" };
    },
  },
};
