/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/**
 * @description
 * Categories class for managing category-related operations.
 */
export class Comments {
  constructor() {
    console.log("Comments class instantiated");
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

    // Simulate a comment lookup in the database
    const comment = {
      id,
      content: "This is a sample comment.",
      userId: 1,
      postId: 1,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Comment.deserialize(comment);

    return comment as unknown as Models.Comment;
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

    // Simulate a comment lookup in the database
    const comments = [
      {
        id: 1,
        content: "This is a sample comment.",
        userId: 1,
        postId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        content: "This is another sample comment.",
        userId: 2,
        postId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    for (const comment of comments) {
      Models.Comment.deserialize(comment);
    }

    return comments as unknown as Models.Comment[];
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

    // Simulate a comment lookup in the database
    const comments = [
      {
        id: 1,
        content: "This is a sample comment.",
        userId,
        postId: 1,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        content: "This is another sample comment.",
        userId,
        postId: 2,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    for (const comment of comments) {
      Models.Comment.deserialize(comment);
    }

    return comments as unknown as Models.Comment[];
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

    // Simulate comment creation in the database
    const newComment = {
      id: Math.floor(Math.random() * 1000), // Simulate auto-increment ID
      content,
      userId,
      postId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Comment.deserialize(newComment);

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

    // Simulate a comment update in the database
    const updatedComment = {
      id,
      content,
      userId: 1,
      postId: 1,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Comment.deserialize(updatedComment);

    return updatedComment as unknown as Models.Comment;
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

    // Simulate a comment deletion in the database
    console.log(`Comment with ID ${id} deleted`);
  }
}
