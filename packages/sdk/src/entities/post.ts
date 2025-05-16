/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/**
 * @description
 * Posts class for managing post-related operations.
 */
export class Posts {
  constructor() {
    console.log("Posts class instantiated");
  }

  /**
   * @description
   * Finds a post by its ID.
   *
   * @param id Post ID
   * @returns {Models.Post} Post if found, otherwise throws an error
   * @throws Error if post ID is invalid or post not found
   */
  async findPostById(id: number): Promise<Models.Post> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    if (id > 1) {
      throw new Error("Post not found");
    }

    // Simulate a post lookup in the database
    const post = {
      id,
      title: "Sample Post",
      content: "This is a sample post.",
      userId: 1,
      categoryId: 1,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Post.deserialize(post);

    return post as unknown as Models.Post;
  }

  /**
   * @description
   * Finds a post by its user id.
   *
   * @param userId Post's user ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if user ID is invalid or post not found
   */
  async findPostsByUserId(userId: number): Promise<Models.Post[]> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    // Simulate a post lookup in the database
    const posts = [
      {
        id: 1,
        title: "Sample Post 1",
        content: "This is a sample post.",
        userId,
        categoryId: 1,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        title: "Sample Post 2",
        content: "This is another sample post.",
        userId,
        categoryId: 1,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    posts.forEach((post) => Models.Post.deserialize(post));

    return posts as unknown as Models.Post[];
  }

  /**
   * @description
   * Finds posts by a category id.
   *
   * @param categoryId Post's category ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if category ID is invalid or post not found
   */
  async findPostsByCategoryId(categoryId: number): Promise<Models.Post[]> {
    if (categoryId <= 0) {
      throw new Error("Invalid category ID");
    }

    // Simulate a post lookup in the database
    const posts = [
      {
        id: 1,
        title: "Sample Post 1",
        content: "This is a sample post.",
        userId: 1,
        categoryId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        title: "Sample Post 2",
        content: "This is another sample post.",
        userId: 1,
        categoryId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    posts.forEach((post) => Models.Post.deserialize(post));

    return posts as unknown as Models.Post[];
  }

  /**
   * @description
   * Finds posts by a user id and category id.
   *
   * @param userId Post's user ID
   * @param categoryId Post's category ID
   * @returns {Models.Post[]} Array of posts if found, otherwise throws an error
   * @throws Error if user ID or category ID is invalid or post not found
   */
  async findPostsByUserIdAndCategoryId(userId: number, categoryId: number): Promise<Models.Post[]> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    if (categoryId <= 0) {
      throw new Error("Invalid category ID");
    }

    // Simulate a post lookup in the database
    const posts = [
      {
        id: 1,
        title: "Sample Post 1",
        content: "This is a sample post.",
        userId,
        categoryId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        title: "Sample Post 2",
        content: "This is another sample post.",
        userId,
        categoryId,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    posts.forEach((post) => Models.Post.deserialize(post));

    return posts as unknown as Models.Post[];
  }

  /**
   * @description
   * Creates a new post.
   *
   * @returns {Models.Post} Created post
   * @throws Error if user ID or category ID is invalid or post not found
   */
  async createPost({
    title,
    categoryId,
    content,
    userId,
  }: Pick<Models.Post, "title" | "content" | "userId" | "categoryId">): Promise<Models.Post> {
    // Simulate a post creation in the database
    const post = {
      id: 1,
      title,
      content,
      userId,
      categoryId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Post.deserialize(post);

    return post as unknown as Models.Post;
  }

  /**
   * @description
   * Updates a post.
   *
   * @param id Post ID
   * @param title Post title
   * @param content Post content
   * @returns {Models.Post} Updated post
   * @throws Error if post ID is invalid or post not found
   */
  async updatePost({
    id,
    title,
    content,
  }: Pick<Models.Post, "id" | "title" | "content">): Promise<Models.Post> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    // Simulate a post update in the database
    const post = {
      id,
      title,
      content,
      userId: 1,
      categoryId: 1,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Post.deserialize(post);

    return post as unknown as Models.Post;
  }

  /**
   * @description
   * Deletes a post.
   *
   * @param id Post ID
   * @throws Error if post ID is invalid or post not found
   */
  async deletePost(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error("Invalid post ID");
    }

    // Simulate a post deletion in the database
    console.log(`Post with ID ${id} deleted`);
  }
}
