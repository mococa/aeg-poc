import { Pool } from "pg";

export class CommentsDatabase {
  private pool: Pool;
  query: Pool["query"];

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        "postgres://aeg:mysecretpassword@localhost:5432/comments",
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
    const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return this.pool.query(createCommentsTable);
  }
}
