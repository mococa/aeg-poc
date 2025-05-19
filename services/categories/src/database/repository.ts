/* ---------- Database ---------- */
import { CategoriesDatabase } from "./client";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

export class CategoriesRepository {
  private database: CategoriesDatabase;

  constructor(database: CategoriesDatabase) {
    this.database = database;
  }

  async createCategory(name: string, description: string) {
    const query = `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [name, description];
    const { rows } = await this.database.query(query, values);

    const category = rows[0];
    Models.Category.deserialize(category);

    return category as Models.Category;
  }

  async getCategoryById(id: number) {
    const query = `
      SELECT * FROM categories
      WHERE id = $1;
    `;
    const { rows } = await this.database.query(query, [id]);
    if (rows.length === 0) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const category = rows[0];
    Models.Category.deserialize(category);

    return category as Models.Category;
  }

  async getCategoriesByIds(ids: number[]) {
    const query = `
      SELECT * FROM categories
      WHERE id = ANY($1::int[]);
    `;

    const { rows } = await this.database.query(query, [ids]);

    for (const row of rows) {
      Models.Category.deserialize(row);
    }

    return rows as Models.Category[];
  }

  async getAllCategories() {
    const query = `
      SELECT * FROM categories;
    `;
    const { rows } = await this.database.query(query);

    for (const row of rows) {
      Models.Category.deserialize(row);
    }

    return rows as Models.Category[];
  }

  async updateCategory(id: number, name: string, description: string) {
    const query = `
      UPDATE categories
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await this.database.query(query, [name, description, id]);
    if (rows.length === 0) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const category = rows[0];
    Models.Category.deserialize(category);

    return category as Models.Category;
  }

  async deleteCategory(id: number) {
    const query = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await this.database.query(query, [id]);
    if (rows.length === 0) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const category = rows[0];
    Models.Category.deserialize(category);

    return category as Models.Category;
  }

  async getCategoryByName(name: string) {
    const query = `
      SELECT * FROM categories
      WHERE name = $1;
    `;
    const { rows } = await this.database.query(query, [name]);
    if (rows.length === 0) {
      throw new Error(`Category with name ${name} not found`);
    }

    const category = rows[0];
    Models.Category.deserialize(category);

    return category as Models.Category;
  }
}
