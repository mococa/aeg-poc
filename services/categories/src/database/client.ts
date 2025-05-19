/* ---------- External ---------- */
import { Pool } from "pg";

export class CategoriesDatabase {
  private pool: Pool;
  query: Pool["query"];

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        "postgres://aeg:mysecretpassword@localhost:5432/categories",
    });

    this.query = this.pool.query.bind(this.pool);
  }

  /**
   * @description
   * Creates the categories table if it does not exist.
   *
   * @returns {Promise<void>}
   */
  async createTables() {
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return this.pool.query(createCategoriesTable);
  }
}
