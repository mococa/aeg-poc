/* ---------- External ---------- */
import request, { gql } from "graphql-request";

/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/* ---------- Utils ---------- */
import { getServiceUrl, Hashing } from "@aeg-poc/utils";

/**
 * @description
 * Users class for managing user-related operations.
 */
export class Users {
  url: string;

  constructor({ url }: { url?: string }) {
    this.url = url ?? getServiceUrl("users");
  }

  /**
   * @description
   * Finds all users in the database.
   *
   * @returns {Models.User[]} Array of users
   */
  async findAllUsers(): Promise<Models.User[]> {
    const query = gql`
      query getUsers {
        getUsers {
          id
          username
          password
          created_at
          updated_at
        }
      }
    `;

    const users = await request<{ getUsers: Models.User[] }>(this.url, query);
    if (!users?.getUsers) {
      throw new Error("Users not found");
    }

    return users.getUsers;
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

    const query = gql`
      query getUserById($id: ID!) {
        getUserById(id: $id) {
          id
          username
          password
          createdAt
          updatedAt
        }
      }
    `;

    const user = await request<{ getUserById: Models.User }>(this.url, query, { id: +id });

    if (!user?.getUserById) {
      throw new Error("User not found");
    }

    return user.getUserById;
  }

  /**
   * @description
   * Finds users by their IDs.
   *
   * @param ids Array of user IDs
   * @returns {Models.User[]} Array of users if found, otherwise throws an error
   * @throws Error if user IDs are invalid or users not found
   */
  async findUsersByIds(ids: number[]): Promise<Models.User[]> {
    if (!ids || ids.length === 0) {
      throw new Error("Invalid user IDs");
    }

    const query = gql`
      query getUsersByIds($ids: [ID!]!) {
        getUsersByIds(ids: $ids) {
          id
          username
          password
          createdAt
          updatedAt
        }
      }
    `;

    const users = await request<{ getUsersByIds: Models.User[] }>(this.url, query, { ids });
    if (!users?.getUsersByIds) {
      throw new Error("Users not found");
    }

    return users.getUsersByIds;
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
    const query = gql`
      query getUserByUsername($username: String!) {
        getUserByUsername(username: $username) {
          id
          username
          password
          created_at
          updated_at
        }
      }
    `;

    const user = await request<{ getUserByUsername: Models.User }>(this.url, query, {
      username,
    });
    if (!user?.getUserByUsername) {
      throw new Error("User not found");
    }

    return user.getUserByUsername;
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

    if (username.length < 3 || username.length > 10) {
      throw new Error("Username must be between 3 and 10 characters");
    }

    if (password.length < 8 || password.length > 24) {
      throw new Error("Password must be between 8 and 24 characters");
    }

    const mutation = gql`
      mutation createUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
          id
          username
          password
          created_at
          updated_at
        }
      }
    `;

    const user = await request<{ createUser: Models.User }>(this.url, mutation, {
      username,
      password: Hashing.generate(password),
    });

    if (!user?.createUser) {
      throw new Error("User creation failed");
    }

    return user.createUser;
  }

  async deleteUser(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    const mutation = gql`
      mutation deleteUserById($id: ID!) {
        deleteUserById(id: $id) {
          id
        }
      }
    `;

    await request(this.url, mutation, { id });
  }
}
