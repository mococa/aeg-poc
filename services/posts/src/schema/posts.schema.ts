/* ---------- External ---------- */
import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";
import {} from "@apollo/server";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { PostsRepository } from "../database";

const sdk = new AegSDK();

export class PostSchema {
  /**
   * @description
   * Repository for the Posts schema.
   * This repository is used to interact with the database and perform CRUD operations.
   */
  repository: PostsRepository;

  /**
   * @description
   * GraphQL type definitions for the Post schema.
   * This schema is used to define the structure of the data and the operations that can be performed on it.
   */
  typeDefs: DocumentNode;
  resolvers: {
    Query: Record<string, (...args) => Promise<Models.Post | Models.Post[]>>;
    Mutation: Record<string, (...args) => Promise<Models.Post | Models.Post[] | boolean>>;
    Post: any;
    User: any;
    Category: any;
  };

  constructor(repository: PostsRepository) {
    this.repository = repository;

    this.typeDefs = gql`
      ${Models.Post.typeDefs}
      ${Models.User.typeDefs}
      ${Models.Category.typeDefs}
      ${Models.Comment.typeDefs}

      extend type Post {
        user: User
        category: Category
        comments: [Comment]
      }

      extend type Query {
        getPosts: [Post!]!
        getPostById(id: ID!): Post
        getPostsByIds(ids: [ID!]!): [Post]
        getPostsByUserId(userId: ID!): [Post]
        getPostsByCategoryId(categoryId: ID!): [Post]
        getPostsByUserIdAndCategoryId(userId: ID!, categoryId: ID!): [Post]
      }

      extend type Mutation {
        createPost(title: String!, content: String!, userId: ID!, categoryId: ID!): Post
        updatePost(id: ID!, title: String!, content: String!): Post
        deletePostById(id: ID!): Boolean
      }
    `;

    this.resolvers = {
      Query: {
        getPosts: async () => {
          const posts = await this.repository.getAllPosts();
          if (!posts) {
            throw new Error(`No posts found`);
          }

          return posts;
        },
        getPostById: async (_, { id }) => {
          const post = await this.repository.getPostById(id);
          if (!post) {
            throw new Error(`Post with ID ${id} not found`);
          }

          return post;
        },
        getPostsByIds: async (_, { ids }) => {
          const posts = await this.repository.getPostsByIds(ids);

          return posts;
        },
        getPostsByUserId: async (_, { userId }) => {
          const posts = await this.repository.getPostsByUserId(userId);
          if (!posts) {
            throw new Error(`No posts found for user ID ${userId}`);
          }

          return posts;
        },
        getPostsByCategoryId: async (_, { categoryId }) => {
          const posts = await this.repository.getPostsByCategoryId(categoryId);
          if (!posts) {
            throw new Error(`No posts found for category ID ${categoryId}`);
          }

          return posts;
        },
        getPostsByUserIdAndCategoryId: async (_, { userId, categoryId }) => {
          const posts = await this.repository.getPostsByUserIdAndCategoryId(
            userId,
            categoryId,
          );
          if (!posts) {
            throw new Error(
              `No posts found for user ID ${userId} and category ID ${categoryId}`,
            );
          }

          return posts;
        },
      },
      Mutation: {
        createPost: async (_, { title, content, userId, categoryId }) => {
          const post = await this.repository.createPost({
            title,
            content,
            userId,
            categoryId,
          });
          if (!post) {
            throw new Error(`Failed to create post`);
          }

          return post;
        },
        updatePost: async (_, { id, title, content, userId, categoryId }) => {
          const post = await this.repository.updatePost({
            id,
            title,
            content,
            userId,
            categoryId,
          });
          if (!post) {
            throw new Error(`Post with ID ${id} not found`);
          }

          return post;
        },
        deletePostById: async (_, { id }) => {
          const removed = await this.repository.deletePost(id);
          return removed;
        },
      },
      Post: {
        user: async (post, _, context) => {
          return context.dataloaders.users.load(post.userId);
        },
        category: async (post, _, context) => {
          return context.dataloaders.categories.load(post.categoryId);
        },
        comments: async (post) => {
          return sdk.comments.findCommentsByPostId(post.id);
        },
        _resolveReference: async (post) => {
          const { id } = post;
          const foundPost = await this.repository.getPostById(id);
          if (!foundPost) {
            throw new Error(`Post with ID ${id} not found`);
          }

          return foundPost;
        },
      },
      User: {
        __resolveReference: async (user, _, context) => {
          return context.dataloaders.users.load(user.id);
        },
      },
      Category: {
        __resolveReference: async (category, _, context) => {
          return context.dataloaders.categories.load(category.id);
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
