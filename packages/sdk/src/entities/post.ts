/* ---------- External ---------- */
import request, { gql } from "graphql-request";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- Utils ---------- */
import { getServiceUrl } from "@aeg-poc/utils";

/**
 * @description
 * Posts class for managing post-related operations.
 */
export class Posts {
  url: string;

  constructor({ url }: { url?: string }) {
    this.url = url ?? getServiceUrl("posts");
  }

  /**
   * @description
   * Finds a post by its ID.
   *
   * @param id Post ID
   * @returns {Models.Post} Post if found, otherwise throws an error
   * @throws Error if post ID is invalid or post not found
   */
  async findPostById(id: number): Promise<Models.Post> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    const query = gql`
      query getPostById($id: ID!) {
        getPostById(id: $id) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const post = await request<{ getPostById: Models.Post }>(this.url, query, { id });
    if (!post?.getPostById) {
      throw new Error("Post not found");
    }

    return post.getPostById;
  }

  /**
   * @description
   * Finds multiple posts by their IDs.
   *
   * @param ids Array of post IDs
   * @throws Error if post IDs are invalid or posts not found
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   */
  async findPostsByIds(ids: number[]): Promise<Models.Post[]> {
    if (!ids || ids.length === 0) {
      throw new Error("Invalid post IDs");
    }

    const query = gql`
      query getPostsByIds($ids: [ID!]!) {
        getPostsByIds(ids: $ids) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const posts = await request<{ getPostsByIds: Models.Post[] }>(this.url, query, { ids });

    if (!posts?.getPostsByIds) {
      throw new Error("Posts not found");
    }

    return posts.getPostsByIds;
  }

  /**
   * @description
   * Finds a post by its user id.
   *
   * @param userId Post's user ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if user ID is invalid or post not found
   */
  async findPostsByUserId(userId: number): Promise<Models.Post[]> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const query = gql`
      query getPostsByUserId($userId: ID!) {
        getPostsByUserId(userId: $userId) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const posts = await request<{ getPostsByUserId: Models.Post[] }>(this.url, query, {
      userId,
    });

    if (!posts?.getPostsByUserId) {
      throw new Error("Posts not found");
    }

    return posts.getPostsByUserId;
  }

  /**
   * @description
   * Finds posts by a category id.
   *
   * @param categoryId Post's category ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if category ID is invalid or post not found
   */
  async findPostsByCategoryId(categoryId: number): Promise<Models.Post[]> {
    if (categoryId <= 0) {
      throw new Error("Invalid category ID");
    }

    const query = gql`
      query getPostsByCategoryId($categoryId: ID!) {
        getPostsByCategoryId(categoryId: $categoryId) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const posts = await request<{ getPostsByCategoryId: Models.Post[] }>(this.url, query, {
      categoryId,
    });

    if (!posts?.getPostsByCategoryId) {
      throw new Error("Posts not found");
    }

    return posts.getPostsByCategoryId;
  }

  /**
   * @description
   * Finds posts by a user id and category id.
   *
   * @param userId Post's user ID
   * @param categoryId Post's category ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if user ID or category ID is invalid or post not found
   */
  async findPostsByUserIdAndCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<Models.Post[]> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    if (categoryId <= 0) {
      throw new Error("Invalid category ID");
    }

    const query = gql`
      query getPostsByUserIdAndCategoryId($userId: ID!, $categoryId: ID!) {
        getPostsByUserIdAndCategoryId(userId: $userId, categoryId: $categoryId) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const posts = await request<{ getPostsByUserIdAndCategoryId: Models.Post[] }>(
      this.url,
      query,
      {
        userId,
        categoryId,
      },
    );

    if (!posts?.getPostsByUserIdAndCategoryId) {
      throw new Error("Posts not found");
    }

    return posts.getPostsByUserIdAndCategoryId;
  }

  /**
   * @description
   * Creates a new post.
   *
   * @returns {Models.Post} Created post
   * @throws Error if user ID or category ID is invalid or post not found
   */
  async createPost({
    title,
    categoryId,
    content,
    userId,
  }: Pick<
    Models.Post,
    "title" | "content" | "userId" | "categoryId"
  >): Promise<Models.Post> {
    if (!title) {
      throw new Error("Invalid post title");
    }

    if (!content) {
      throw new Error("Invalid post content");
    }

    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    if (categoryId <= 0) {
      throw new Error("Invalid category ID");
    }

    const mutation = gql`
      mutation createPost(
        $title: String!
        $content: String!
        $userId: ID!
        $categoryId: ID!
      ) {
        createPost(
          title: $title
          content: $content
          userId: $userId
          categoryId: $categoryId
        ) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const post = await request<{ createPost: Models.Post }>(this.url, mutation, {
      title,
      content,
      userId,
      categoryId,
    });

    if (!post?.createPost) {
      throw new Error("Post not found");
    }

    return post.createPost;
  }

  /**
   * @description
   * Updates a post.
   *
   * @param id Post ID
   * @param title Post title
   * @param content Post content
   * @returns {Models.Post} Updated post
   * @throws Error if post ID is invalid or post not found
   */
  async updatePost({
    id,
    title,
    content,
  }: Pick<Models.Post, "id" | "title" | "content">): Promise<Models.Post> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    if (!title) {
      throw new Error("Invalid post title");
    }

    if (!content) {
      throw new Error("Invalid post content");
    }

    const mutation = gql`
      mutation updatePost($id: ID!, $title: String!, $content: String!) {
        updatePost(id: $id, title: $title, content: $content) {
          id
          title
          content
          userId
          categoryId
          createdAt
          updatedAt
        }
      }
    `;

    const post = await request<{ updatePost: Models.Post }>(this.url, mutation, {
      id,
      title,
      content,
    });

    if (!post?.updatePost) {
      throw new Error("Post not found");
    }

    return post.updatePost;
  }

  /**
   * @description
   * Deletes a post.
   *
   * @param id Post ID
   * @throws Error if post ID is invalid or post not found
   */
  async deletePost(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    const mutation = gql`
      mutation deletePostById($id: ID!) {
        deletePostById(id: $id) {
          id
        }
      }
    `;

    await request<Models.Post>(this.url, mutation, { id });
  }
}
