/* ---------- External ---------- */
import request, { gql } from "graphql-request";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- Utils ---------- */
import { getServiceUrl } from "@aeg-poc/utils";

/**
 * @description
 * Categories class for managing category-related operations.
 */
export class Categories {
  url?: string;

  constructor({ url }: { url: string }) {
    this.url = url ?? getServiceUrl("categories");
  }

  /**
   * @description
   * Finds a category by its ID.
   *
   * @param id Category ID
   * @returns {Models.Category} Category if found, otherwise throws an error
   * @throws Error if category ID is invalid or category not found
   */
  async findCategoryById(id: number): Promise<Models.Category> {
    if (id < 0) {
      throw new Error("Invalid category ID");
    }

    const query = gql`
      query getCategoryById($id: ID!) {
        getCategoryById(id: $id) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const category = await request<{ getCategoryById: Models.Category }>(this.url, query, {
      id,
    });

    if (!category?.getCategoryById) {
      throw new Error("Category not found");
    }

    return category.getCategoryById;
  }

  /**
   * @description
   * Finds categories by their IDs.
   *
   * @param ids Array of category IDs
   * @returns {Models.Category[]} Array of categories if found, otherwise throws an error
   * @throws Error if category IDs are invalid or categories not found
   */
  async findCategoriesByIds(ids: number[]): Promise<Models.Category[]> {
    if (!ids || ids.length === 0) {
      throw new Error("Invalid category IDs");
    }

    const query = gql`
      query getCategoriesByIds($ids: [ID!]!) {
        getCategoriesByIds(ids: $ids) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const categories = await request<{ getCategoriesByIds: Models.Category[] }>(
      this.url,
      query,
      {
        ids,
      },
    );

    if (!categories?.getCategoriesByIds) {
      throw new Error("Categories not found");
    }

    return categories.getCategoriesByIds;
  }

  /**
   * @description
   * Finds a category by its name.
   *
   * @param name Category's name
   * @returns {Models.Category} Category if found, otherwise throws an error
   * @throws Error if category name is invalid or category not found
   */
  async findCategoryByName(name: string): Promise<Models.Category> {
    if (!name) {
      throw new Error("Invalid category name");
    }

    const query = gql`
      query getCategoryByName($name: String!) {
        getCategoryByName(name: $name) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const category = await request<{ getCategoryByName: Models.Category }>(
      this.url,
      query,
      { name },
    );

    if (!category?.getCategoryByName) {
      throw new Error("Category not found");
    }

    return category.getCategoryByName;
  }

  /**
   * @description
   * Finds all categories.
   *
   * @returns {Models.Category[]} Array of categories
   */
  async findAllCategories(): Promise<Models.Category[]> {
    const query = gql`
      query getCategories {
        getCategories {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const categories = await request<{ getCategories: Models.Category[] }>(this.url, query);
    if (!categories?.getCategories) {
      throw new Error("Categories not found");
    }

    return categories.getCategories;
  }

  /**
   * @description
   * Creates a new category.
   *
   * @param name Category's name
   * @returns {Models.Category} Newly created category
   */
  async createCategory(name: string): Promise<Models.Category> {
    if (!name) {
      throw new Error("Invalid category name");
    }

    const mutation = gql`
      mutation createCategory($name: String!) {
        createCategory(name: $name) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const category = await request<Models.Category>(this.url, mutation, { name });

    return category;
  }

  /**
   * @description
   * Updates a category.
   *
   * @param id Category ID
   * @param name Category's new name
   * @returns {Models.Category} Updated category
   */
  async updateCategory(id: number, name: string): Promise<Models.Category> {
    if (id <= 0) {
      throw new Error("Invalid category ID");
    }
    if (!name) {
      throw new Error("Invalid category name");
    }

    const mutation = gql`
      mutation updateCategory($id: ID!, $name: String!) {
        updateCategory(id: $id, name: $name) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    const category = await request<Models.Category>(this.url, mutation, { id, name });

    return category as unknown as Models.Category;
  }

  /**
   * @description
   * Deletes a category.
   *
   * @param id Category ID
   * @throws Error if category ID is invalid or category not found
   */
  async deleteCategory(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid category ID");
    }

    const mutation = gql`
      mutation deleteCategoryById($id: ID!) {
        deleteCategory(id: $id) {
          id
        }
      }
    `;

    await request(this.url, mutation, { id });
  }
}
