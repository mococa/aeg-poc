import { Pool } from "pg";

export class UsersDatabase {
  private pool: Pool;
  query: Pool["query"];

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ?? "postgres://aeg:mysecretpassword@localhost:5432/users",
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
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(24) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return this.pool.query(createUsersTable);
  }
}
