/**
 * @description
 * Base model for all entities.
 */
export class BaseModel {
  /**
   * @description
   * ID of the model.
   */
  id: number;

  /**
   * @description
   * Date of creation in milliseconds since Jan 1st 1970.
   */
  createdAt: number;

  /**
   * @description
   * Date of last update in milliseconds since Jan 1st 1970.
   */
  updatedAt: number;

  /**
   * @description
   * Deserialization function that edits the row
   * from SQL to match the TypeScript model (snake_case
   * to camelCase)
   *
   * @example
   * "user_id" // turns into userId
   *
   * @param row SQL row
   * @returns new row edited
   */
  static deserialize(row: Record<string, unknown>) {
    row.createdAt = new Date(row.created_at as string).getTime();
    row.updatedAt = new Date(row.updated_at as string).getTime();
    delete row.created_at;
    delete row.updated_at;
  }

  /**
   * @description
   * GraphQL schema definition for the model.
   */
  static get typeDefs(): string {
    return `
      type BaseModel @key(fields: "id") {
        id: ID!
        createdAt: String!
        updatedAt: String!
      }
    `;
  }
}

export namespace Models {
  export class User extends BaseModel {
    /**
     * @description
     * Username of the user.
     */
    username: string;

    /**
     * @description
     * Hashed password of the user.
     */
    password: string;

    static deserialize(row: Record<string, unknown>): void {
      super.deserialize(row);
    }

    static get typeDefs(): string {
      return `
        type User @key(fields: "id") {
          id: ID!
          username: String!
          password: String!
          createdAt: String!
          updatedAt: String!
        }
      `;
    }
  }

  export class Post extends BaseModel {
    /**
     * @description
     * Title of the post.
     */
    title: string;

    /**
     * @description
     * Content of the post.
     */
    content: string;

    /**
     * @description
     * ID of the user who created the post.
     */
    userId: number;

    /**
     * @description
     * ID of the category of the post.
     */
    categoryId: number;

    static deserialize(row: Record<string, unknown>): void {
      super.deserialize(row);
      row.categoryId = row.category_id;
      delete row.category_id;

      row.userId = row.user_id;
      delete row.user_id;
    }

    static get typeDefs(): string {
      return `
        type Post @key(fields: "id") {
          id: ID!
          title: String!
          content: String!
          userId: ID!
          categoryId: ID!
          createdAt: String!
          updatedAt: String!
        }
      `;
    }
  }

  export class Category extends BaseModel {
    /**
     * @description
     * Name of the category.
     */
    name: string;

    /**
     * @description
     * Description of the category.
     */
    description: string;

    static deserialize(row: Record<string, unknown>): void {
      super.deserialize(row);
    }

    static get typeDefs(): string {
      return `
        type Category @key(fields: "id") {
          id: ID!
          name: String!
          description: String!
          createdAt: String!
          updatedAt: String!
        }
      `;
    }
  }

  export class Comment extends BaseModel {
    /**
     * @description
     * Content of the comment.
     */
    content: string;

    /**
     * @description
     * ID of the user who created the comment.
     */
    userId: number;

    /**
     * @description
     * ID of the post to which the comment belongs.
     */
    postId: number;

    static deserialize(row: Record<string, unknown>): void {
      super.deserialize(row);
      row.userId = row.user_id;
      delete row.user_id;

      row.postId = row.post_id;
      delete row.post_id;
    }

    static get typeDefs(): string {
      return `
        type Comment @key(fields: "id") {
          id: ID!
          content: String!
          userId: ID!
          postId: ID!
          createdAt: String!
          updatedAt: String!
        }
      `;
    }
  }
}
