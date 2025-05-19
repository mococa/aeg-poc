import { PostsDatabase } from "./client";

import { Models } from "@aeg-poc/models";

export class PostsRepository {
  private database: PostsDatabase;

  constructor(database: PostsDatabase) {
    this.database = database;
  }

  async createPost({
    title,
    content,
    userId,
    categoryId,
  }: Pick<
    Models.Post,
    "title" | "content" | "userId" | "categoryId"
  >): Promise<Models.Post> {
    const query = `
      INSERT INTO posts (title, content, user_id, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [title, content, userId, categoryId]);
    const post = rows[0];

    Models.Post.deserialize(post);
    return post as Models.Post;
  }

  async getAllPosts(): Promise<Models.Post[]> {
    const query = `
      SELECT * FROM posts;
    `;

    const { rows: posts } = await this.database.query(query);

    for (const row of posts) {
      Models.Post.deserialize(row);
    }

    return posts as Models.Post[];
  }

  async getPostsByUserId(userId: number): Promise<Models.Post[]> {
    const query = `
      SELECT * FROM posts
      WHERE user_id = $1;
    `;

    const { rows: posts } = await this.database.query(query, [userId]);

    for (const row of posts) {
      Models.Post.deserialize(row);
    }

    return posts as Models.Post[];
  }

  async getPostsByCategoryId(categoryId: number): Promise<Models.Post[]> {
    const query = `
      SELECT * FROM posts
      WHERE category_id = $1;
    `;

    const { rows: posts } = await this.database.query(query, [categoryId]);

    for (const row of posts) {
      Models.Post.deserialize(row);
    }

    return posts as Models.Post[];
  }

  async getPostById(postId: number): Promise<Models.Post | null> {
    const query = `
      SELECT * FROM posts
      WHERE id = $1;
    `;

    const { rows } = await this.database.query(query, [postId]);

    if (rows.length === 0) {
      return null;
    }

    const post = rows[0];
    Models.Post.deserialize(post);
    return post as Models.Post;
  }

  async getPostsByIds(postIds: number[]): Promise<Models.Post[]> {
    const query = `
      SELECT * FROM posts
      WHERE id = ANY($1::int[]);
    `;

    const { rows: posts } = await this.database.query(query, [postIds]);

    for (const row of posts) {
      Models.Post.deserialize(row);
    }

    return posts as Models.Post[];
  }

  async updatePost({
    title,
    content,
    userId,
    categoryId,
    id,
  }: Pick<
    Models.Post,
    "title" | "content" | "userId" | "categoryId" | "id"
  >): Promise<Models.Post | null> {
    const query = `
      UPDATE posts
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          user_id = COALESCE($3, user_id),
          category_id = COALESCE($4, category_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [
      title,
      content,
      userId,
      categoryId,
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    const post = rows[0];
    Models.Post.deserialize(post);
    return post as Models.Post;
  }

  async deletePost(postId: number): Promise<boolean> {
    const query = `
      DELETE FROM posts
      WHERE id = $1;
    `;

    const { rowCount } = await this.database.query(query, [postId]);
    return Boolean(rowCount);
  }

  async getPostsByUserIdAndCategoryId(
    userId: number,
    categoryId: number,
  ): Promise<Models.Post[]> {
    const query = `
      SELECT * FROM posts
      WHERE user_id = $1 AND category_id = $2;
    `;

    const { rows: posts } = await this.database.query(query, [userId, categoryId]);

    for (const row of posts) {
      Models.Post.deserialize(row);
    }

    return posts as Models.Post[];
  }
}
