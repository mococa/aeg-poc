import { UsersDatabase } from "./client";

import { Models } from "@aeg-poc/models";

export class UsersRepository {
  private database: UsersDatabase;

  constructor(database: UsersDatabase) {
    this.database = database;
  }

  /**
   * @description
   * Creates a new user in the database.
   *
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns - The created user object.
   */
  async createUser({
    username,
    password,
  }: Pick<Models.User, "username" | "password">): Promise<Models.User> {
    const query = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [username, password]);
    const user = rows[0];

    Models.User.deserialize(user);
    return user as Models.User;
  }

  /**
   * @description
   * Retrieves a user by their ID.
   *
   * @param id - The ID of the user to retrieve.
   * @returns - The user object.
   */
  async getUserById(id: number): Promise<Models.User> {
    const query = `
      SELECT * FROM users
      WHERE id = $1;
    `;

    const { rows } = await this.database.query(query, [id]);
    if (rows.length === 0) {
      throw new Error(`User with ID ${id} not found`);
    }

    const user = rows[0];
    Models.User.deserialize(user);

    return user as Models.User;
  }

  async getUsersByIds(ids: number[]): Promise<Models.User[]> {
    const query = `
      SELECT * FROM users
      WHERE id = ANY($1::int[]);
    `;

    const { rows } = await this.database.query(query, [ids]);
    for (const row of rows) {
      Models.User.deserialize(row);
    }

    return rows as Models.User[];
  }

  /**
   * @description
   * Retrieves a user by their username.
   *
   * @param username - The username of the user to retrieve.
   * @returns - The user object.
   */
  async getUserByUsername(username: string): Promise<Models.User> {
    const query = `
      SELECT * FROM users
      WHERE username = $1;
    `;

    const { rows } = await this.database.query(query, [username]);
    if (rows.length === 0) {
      throw new Error(`User with username ${username} not found`);
    }

    const user = rows[0];
    Models.User.deserialize(user);

    return user as Models.User;
  }

  /**
   * @description
   * Retrieves all users from the database.
   *
   * @returns - An array of user objects.
   */
  async getAllUsers(): Promise<Models.User[]> {
    const query = `
      SELECT * FROM users;
    `;

    const { rows: users } = await this.database.query(query);

    for (const row of users) {
      Models.User.deserialize(row);
    }

    return users as Models.User[];
  }

  /**
   * @description
   * Updates a user in the database.
   *
   * @param id - The ID of the user to update.
   * @param username - The new username of the user.
   * @param password - The new password of the user.
   * @returns - The updated user object.
   */
  async updateUser({
    id,
    username,
    password,
  }: Pick<Models.User, "id" | "username" | "password">): Promise<Models.User> {
    const query = `
      UPDATE users
      SET username = $1, password = $2
      WHERE id = $3
      RETURNING *;
    `;

    const { rows } = await this.database.query(query, [username, password, id]);
    if (rows.length === 0) {
      throw new Error(`User with ID ${id} not found`);
    }

    const user = rows[0];
    Models.User.deserialize(user);

    return user as Models.User;
  }

  /**
   * @description
   * Deletes a user from the database.
   *
   * @param id - The ID of the user to delete.
   * @returns - A boolean indicating whether the deletion was successful.
   */
  async deleteUser(id: number): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1;
    `;

    const { rowCount } = await this.database.query(query, [id]);
    return Boolean(rowCount);
  }
}
