/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/**
 * @description
 * Users class for managing user-related operations.
 */
export class Users {
  constructor() {
    console.log("Users class instantiated");
  }

  async findAllUsers(): Promise<Models.User[]> {
    // Simulate a user lookup in the database
    const users = [
      {
        id: 1,
        username: "john_doe",
        password: "hashed_password",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    for (const user of users) {
      Models.User.deserialize(user);
    }

    return users as unknown as Models.User[];
  }

  /**
   * @description
   * Finds a user by their ID.
   *
   * @param id User ID
   * @returns {Models.User} User if found, otherwise throws an error
   * @throws Error if user ID is invalid or user not found
   */
  async findUserById(id: number): Promise<Models.User> {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    if (id > 1) {
      throw new Error("User not found");
    }

    // Simulate a user lookup in the database
    const user = {
      id,
      username: "john_doe",
      password: "hashed_password",
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.User.deserialize(user);

    return user as unknown as Models.User;
  }

  /**
   * @description
   * Finds a user by their username.
   *
   * @param username User's username
   * @returns {Models.User} User if found, otherwise throws an error
   * @throws Error if username is invalid or user not found
   */
  async findUserByUsername(username: string): Promise<Models.User> {
    if (!username) {
      throw new Error("Invalid username");
    }

    if (username !== "john_doe") {
      throw new Error("User not found");
    }

    // Simulate a user lookup in the database
    const user = {
      id: 1,
      username,
      password: "hashed_password",
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.User.deserialize(user as unknown as Record<string, unknown>);

    return user as unknown as Models.User;
  }

  /**
   * @description
   * Creates a new user.
   *
   * @param username User's username
   * @param password User's password
   * @returns {Models.User} Newly created user
   */
  async createUser(username: string, password: string): Promise<Models.User> {
    if (!username || !password) {
      throw new Error("Invalid username or password");
    }

    // Simulate a user creation in the database
    const user = {
      id: 1,
      username,
      password: "hashed_password",
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.User.deserialize(user as unknown as Record<string, unknown>);

    return user as unknown as Models.User;
  }

  async deleteUser(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    // Simulate user deletion
    console.log(`User with ID ${id} deleted`);
  }
}
