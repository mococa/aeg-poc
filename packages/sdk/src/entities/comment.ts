/* ---------- External ---------- */
import request, { gql } from "graphql-request";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- Utils ---------- */
import { getServiceUrl } from "@aeg-poc/utils";

/**
 * @description
 * Comments class for managing comment-related operations.
 */
export class Comments {
  url: string;

  constructor({ url }: { url?: string }) {
    this.url = url ?? getServiceUrl("comments");
  }

  /**
   * @description
   * Finds a comment by its ID.
   *
   * @param id Comment ID
   * @returns {Models.Comment} Comment if found, otherwise throws an error
   * @throws Error if comment ID is invalid or comment not found
   */
  async findCommentById(id: number): Promise<Models.Comment> {
    if (id <= 0) {
      throw new Error("Invalid comment ID");
    }

    if (id > 1) {
      throw new Error("Comment not found");
    }

    const query = gql`
      query getCommentById($id: ID!) {
        getCommentById(id: $id) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const comment = await request<{ getCommentById: Models.Comment }>(this.url, query, {
      id,
    });

    if (!comment?.getCommentById) {
      throw new Error("Comment not found");
    }

    return comment.getCommentById;
  }

  /**
   * @description
   * Finds comments by their IDs.
   *
   * @param ids Array of comment IDs
   * @returns {Models.Comment[]} Array of comments if found, otherwise throws an error
   * @throws Error if comment IDs are invalid or comments not found
   */
  async findCommentsByIds(ids: number[]): Promise<Models.Comment[]> {
    if (!ids || ids.length === 0) {
      throw new Error("Invalid comment IDs");
    }

    const query = gql`
      query getCommentsByIds($ids: [ID!]!) {
        getCommentsByIds(ids: $ids) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const comments = await request<{ getCommentsByIds: Models.Comment[] }>(
      this.url,
      query,
      {
        ids,
      },
    );

    if (!comments?.getCommentsByIds) {
      throw new Error("Comments not found");
    }

    return comments.getCommentsByIds;
  }

  /**
   * @description
   * Finds comments by their post ID.
   *
   * @param postId Post ID
   * @returns {Models.Comment[]} Array of comments if found, otherwise throws an error
   * @throws Error if post ID is invalid or comments not found
   */
  async findCommentsByPostId(postId: number): Promise<Models.Comment[]> {
    if (postId <= 0) {
      throw new Error("Invalid post ID");
    }

    const query = gql`
      query getComments($postId: ID!) {
        getCommentsByPostId(postId: $postId) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const comments = await request<{ getCommentsByPostId: Models.Comment[] }>(
      this.url,
      query,
      { postId },
    );

    if (!comments?.getCommentsByPostId) {
      throw new Error("Comments not found");
    }

    return comments.getCommentsByPostId;
  }

  /**
   * @description
   * Finds comments by their user ID.
   *
   * @param userId User ID
   * @returns {Models.Comment[]} Array of comments if found, otherwise throws an error
   * @throws Error if user ID is invalid or comments not found
   */
  async findCommentsByUserId(userId: number): Promise<Models.Comment[]> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const query = gql`
      query getCommentsByUserId($userId: ID!) {
        getCommentsByUserId(userId: $userId) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const comments = await request<{ getCommentsByUserId: Models.Comment[] }>(
      this.url,
      query,
      { userId },
    );

    if (!comments?.getCommentsByUserId) {
      throw new Error("Comments not found");
    }

    return comments.getCommentsByUserId;
  }

  /**
   * @description
   * Creates a new comment.
   *
   * @returns {Models.Comment} Created comment
   * @throws Error if comment content is invalid or post ID is invalid
   */
  async createComment({
    content,
    postId,
    userId,
  }: Pick<Models.Comment, "content" | "postId" | "userId">): Promise<Models.Comment> {
    if (!content) {
      throw new Error("Invalid comment content");
    }

    if (postId <= 0) {
      throw new Error("Invalid post ID");
    }

    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const mutation = gql`
      mutation createComment($content: String!, $postId: ID!, $userId: ID!) {
        createComment(content: $content, postId: $postId, userId: $userId) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const newComment = await request<Models.Comment>(this.url, mutation, {
      content,
      postId,
      userId,
    });

    return newComment as unknown as Models.Comment;
  }

  /**
   * @description
   * Updates a comment.
   *
   * @param id Comment ID
   * @param content Comment's new content
   * @returns {Models.Comment} Updated comment
   * @throws Error if comment ID is invalid or comment not found
   */
  async updateComment({
    id,
    content,
  }: Pick<Models.Comment, "id" | "content">): Promise<Models.Comment> {
    if (id <= 0) {
      throw new Error("Invalid comment ID");
    }

    if (!content) {
      throw new Error("Invalid comment content");
    }

    const mutation = gql`
      mutation updateComment($id: ID!, $content: String!) {
        updateComment(id: $id, content: $content) {
          id
          content
          userId
          postId
          createdAt
          updatedAt
        }
      }
    `;

    const updatedComment = await request<Models.Comment>(this.url, mutation, {
      id,
      content,
    });

    return updatedComment;
  }

  /**
   * @description
   * Deletes a comment.
   *
   * @param id Comment ID
   * @throws Error if comment ID is invalid or comment not found
   */
  async deleteComment(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid comment ID");
    }

    const mutation = gql`
      mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
          id
        }
      }
    `;

    await request<Models.Comment>(this.url, mutation, { id });
  }
}
