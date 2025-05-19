/* ---------- External ---------- */
import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- Database ---------- */
import { CategoriesRepository } from "../database/repository";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

const sdk = new AegSDK();

export class CategorySchema {
  /**
   * @description
   * Repository for the Category schema.
   * This repository is used to interact with the database and perform CRUD operations.
   */
  repository: CategoriesRepository;

  /**
   * @description
   * GraphQL type definitions for the Category schema.
   * This schema is used to define the structure of the data and the operations that can be performed on it.
   */
  typeDefs: DocumentNode;
  resolvers: {
    Query: Record<string, (...args) => Promise<Models.Category | Models.Category[]>>;
    Mutation: Record<string, (...args) => Promise<Models.Category | Models.Category[]>>;
    Category: any;
  };

  constructor(repository: CategoriesRepository) {
    this.repository = repository;

    this.typeDefs = gql`
      ${Models.User.typeDefs}
      ${Models.Post.typeDefs}
      ${Models.Comment.typeDefs}
      ${Models.Category.typeDefs}

      extend type Category {
        posts: [Post]
      }

      extend type Query {
        getCategories: [Category]
        getCategoryById(id: ID!): Category
        getCategoriesByIds(ids: [ID!]!): [Category]
        getCategoryByName(name: String!): Category
      }

      extend type Mutation {
        createCategory(name: String!, description: String): Category
        updateCategory(id: ID!, name: String, description: String): Category
        deleteCategory(id: ID!): Boolean
      }
    `;

    this.resolvers = {
      Query: {
        getCategories: async () => {
          const categories = await this.repository.getAllCategories();
          return categories;
        },
        getCategoryById: async (_, { id }) => {
          const category = await this.repository.getCategoryById(id);
          if (!category) {
            throw new Error(`Category with ID ${id} not found`);
          }
          return category;
        },
        getCategoriesByIds: async (_, { ids }) => {
          const categories = await this.repository.getCategoriesByIds(ids);
          return categories;
        },
        getCategoryByName: async (_, { name }) => {
          const category = await this.repository.getCategoryByName(name);
          if (!category) {
            throw new Error(`Category with name ${name} not found`);
          }
          return category;
        },
        __resolveReference: async (category) => {
          const categoryData = await this.repository.getCategoryById(category.id);
          if (!categoryData) {
            throw new Error(`Category with ID ${category.id} not found`);
          }

          return categoryData;
        },
      },
      Mutation: {
        createCategory: async (_, { name, description }) => {
          const category = await this.repository.createCategory(name, description);
          return category;
        },
        updateCategory: async (_, { id, name, description }) => {
          const category = await this.repository.updateCategory(id, name, description);
          if (!category) {
            throw new Error(`Category with ID ${id} not found`);
          }
          return category;
        },
        deleteCategory: async (_, { id }) => {
          const result = await this.repository.deleteCategory(id);
          if (!result) {
            throw new Error(`Category with ID ${id} not found`);
          }
          return result;
        },
      },
      Category: {
        posts: async (parent) => {
          const posts = await sdk.posts.findPostsByCategoryId(parent.id);
          return posts;
        },
        __resolveReference: async (category, _, context) => {
          const categoryData = await this.repository.getCategoryById(category.id);
          if (!categoryData) {
            throw new Error(`Category with ID ${category.id} not found`);
          }

          return categoryData;
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
