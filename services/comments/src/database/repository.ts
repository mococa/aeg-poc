import { CommentsDatabase } from "./client";

import { Models } from "@aeg-poc/models";

export class CommentsRepository {
  private database: CommentsDatabase;

  constructor(database: CommentsDatabase) {
    this.database = database;
  }

  /**
   * @description
   * Creates a new comment in the database.
   *
   * @param content - The content of the comment.
   * @param postId - The ID of the post the comment belongs to.
   * @param userId - The ID of the user who made the comment.
   * @returns - The created comment object.
   */
  async createComment({
    content,
    postId,
    userId,
  }: Pick<Models.Comment, "content" | "postId" | "userId">): Promise<Models.Comment> {
    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [postId, userId, content]);
    const comment = rows[0];

    Models.Comment.deserialize(comment);
    return comment as Models.Comment;
  }

  /**
   * @description
   * Retrieves all comments for a specific post.
   *
   * @param postId - The ID of the post to retrieve comments for.
   * @returns - An array of comment objects.
   */
  async getCommentsByPostId(postId: number): Promise<Models.Comment[]> {
    const query = `
      SELECT * FROM comments
      WHERE post_id = $1;
    `;

    const { rows: comments } = await this.database.query(query, [postId]);

    for (const row of comments) {
      Models.Comment.deserialize(row);
    }

    return comments as Models.Comment[];
  }

  /**
   * @description
   * Retrieves a comment by its ID.
   *
   * @param commentId - The ID of the comment to retrieve.
   * @returns - The comment object or null if not found.
   */
  async getCommentById(commentId: number): Promise<Models.Comment | null> {
    const query = `
      SELECT * FROM comments
      WHERE id = $1;
    `;

    const { rows } = await this.database.query(query, [commentId]);
    const comment = rows[0];

    if (comment) {
      Models.Comment.deserialize(comment);
      return comment as Models.Comment;
    }

    return null;
  }

  /**
   * @description
   * Retrieves multiple comments by their IDs.
   *
   * @param commentIds - The IDs of the comments to retrieve.
   * @returns - An array of comment objects.
   */
  async getCommentsByIds(commentIds: number[]): Promise<Models.Comment[]> {
    const query = `
      SELECT * FROM comments
      WHERE id = ANY($1::int[]);
    `;

    const { rows: comments } = await this.database.query(query, [commentIds]);

    for (const row of comments) {
      Models.Comment.deserialize(row);
    }

    return comments as Models.Comment[];
  }

  /**
   * @description
   * Retrieves all comments made by a specific user.
   *
   * @param userId - The ID of the user to retrieve comments for.
   * @returns - An array of comment objects.
   */
  async getCommentsByUserId(userId: number): Promise<Models.Comment[]> {
    const query = `
      SELECT * FROM comments
      WHERE user_id = $1;
    `;

    const { rows: comments } = await this.database.query(query, [userId]);

    for (const row of comments) {
      Models.Comment.deserialize(row);
    }

    return comments as Models.Comment[];
  }

  /**
   * @description
   * Updates a comment by its ID.
   *
   * @param id - The ID of the comment to update.
   * @param content - The new content of the comment.
   * @returns - The updated comment or null if not found.
   */
  async updateComment({
    id,
    content,
  }: Pick<Models.Comment, "id" | "content">): Promise<Models.Comment | null> {
    const query = `
      UPDATE comments
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [content, id]);
    const comment = rows[0];

    if (comment) {
      Models.Comment.deserialize(comment);
      return comment as Models.Comment;
    }

    return null;
  }

  /**
   * @description
   * Deletes a comment by its ID.
   *
   * @param commentId - The ID of the comment to delete.
   * @returns
   */
  async deleteComment(commentId: number): Promise<boolean> {
    const query = `
      DELETE FROM comments
      WHERE id = $1;
    `;

    const { rowCount } = await this.database.query(query, [commentId]);
    return Boolean(rowCount);
  }
}
