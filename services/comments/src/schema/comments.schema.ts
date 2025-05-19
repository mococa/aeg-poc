/* ---------- External ---------- */
import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { CommentsRepository } from "../database/repository";

const sdk = new AegSDK();

export class CommentSchema {
  /**
   * @description
   * Repository for the Comment schema.
   * This repository is used to interact with the database and perform CRUD operations.
   */
  repository: CommentsRepository;

  /**
   * @description
   * GraphQL type definitions for the Comment schema.
   * This schema is used to define the structure of the data and the operations that can be performed on it.
   */
  typeDefs: DocumentNode;
  resolvers: {
    Query: Record<string, (...args) => Promise<Models.Comment | Models.Comment[]>>;
    Mutation: Record<
      string,
      (...args) => Promise<Models.Comment | Models.Comment[] | boolean>
    >;
    Comment: any;
    Post: any;
    Category: any;
    User: any;
  };

  constructor(repository: CommentsRepository) {
    this.repository = repository;

    this.typeDefs = gql`
      ${Models.User.typeDefs}
      ${Models.Post.typeDefs}
      ${Models.Category.typeDefs}
      ${Models.Comment.typeDefs}

      extend type Comment {
        post: Post
        user: User
      }

      extend type Post {
        user: User
        category: Category
        comments: [Comment]
      }

      extend type User {
        posts: [Post]
      }

      extend type Category {
        posts: [Post]
      }

      extend type Query {
        getCommentById(id: ID!): Comment
        getCommentsByPostId(postId: ID!): [Comment]
        getCommentsByUserId(userId: ID!): [Comment]
        getCommentsByIds(ids: [ID!]!): [Comment]
      }

      extend type Mutation {
        createComment(content: String!, postId: ID!, userId: ID!): Comment
        updateComment(id: ID!, content: String!): Comment
        deleteComment(id: ID!): Boolean
      }
    `;

    this.resolvers = {
      Query: {
        getCommentById: async (_, { id }) => {
          const comment = await this.repository.getCommentById(id);
          if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
          }

          return comment;
        },
        getCommentsByIds: async (_, { ids }) => {
          const comments = await this.repository.getCommentsByIds(ids);

          return comments;
        },
        getCommentsByPostId: async (_, { postId }) => {
          const comments = await this.repository.getCommentsByPostId(postId);
          if (!comments) {
            throw new Error(`No comments found for post ID ${postId}`);
          }

          return comments;
        },
        getCommentsByUserId: async (_, { userId }) => {
          const comments = await this.repository.getCommentsByUserId(userId);
          if (!comments) {
            throw new Error(`No comments found for user ID ${userId}`);
          }

          return comments;
        },
      },
      Mutation: {
        createComment: async (_, { content, userId, postId }) => {
          const comment = await this.repository.createComment({ content, userId, postId });

          return comment;
        },
        updateComment: async (_, { id, content }) => {
          const comment = await this.repository.updateComment({ id, content });
          if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
          }

          return comment;
        },
        deleteComment: async (_, { id }) => {
          const result = await this.repository.deleteComment(id);
          if (!result) {
            console.error(`Comment with ID ${id} not found`);
            return false;
          }

          return result;
        },
      },
      Comment: {
        post: async (comment, _, context) => {
          return context.dataloaders.posts.load(comment.postId);
        },
        user: async (comment, _, context) => {
          return context.dataloaders.users.load(comment.userId);
        },
        __resolveReference: async (comment) => {
          const data = await this.repository.getCommentById(comment.id);
          if (!data) {
            throw new Error(`Comment with ID ${comment.id} not found`);
          }

          return data;
        },
      },
      Post: {
        user: async (post, _, context) => {
          if (!post.userId) {
            post = await context.dataloaders.posts.load(post.id);
          }

          return context.dataloaders.users.load(post.userId);
        },
        category: async (post, _, context) => {
          const data = await context.dataloaders.categories.load(post.categoryId);
          return data
        },
        _resolveReference: async (post, _, context) => {
          const data = await context.dataloaders.posts.load(post.id);
          if (!data) {
            throw new Error(`Post with ID ${post.id} not found`);
          }

          return data;
        },
      },
      Category: {
        posts: async (category) => {
          return sdk.posts.findPostsByCategoryId(category.id);
        },
        __resolveReference: async (category, _, context) => {
          const data = await sdk.categories.findCategoryById(category.id);
          return data;
        },
      },
      User: {
        posts: async (user) => {
          return sdk.posts.findPostsByUserId(user.id);
        },
        __resolveReference: async (user, _, context) => {
          return sdk.users.findUserById(user.id);
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
