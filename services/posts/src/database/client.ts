import { Pool } from "pg";

const defaultConnectionString = "postgres://aeg:mysecretpassword@localhost:5432/posts";

export class PostsDatabase {
  private pool: Pool;
  query: Pool["query"];

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? defaultConnectionString,
    });

    this.query = this.pool.query.bind(this.pool);
  }

  /**
   * @description
   * Creates the comments table if it does not exist.
   *
   * @returns {Promise<void>}
   */
  async createTables() {
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return this.pool.query(createPostsTable);
  }
}
