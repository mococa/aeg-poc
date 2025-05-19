/* ---------- External ---------- */
import DataLoader from "dataloader";

/* ---------- SDK ---------- */
import type { AegSDK } from "@aeg-poc/sdk";

/**
 * @description
 * Creates DataLoaders for the AegSDK.
 * DataLoaders are used to batch and cache requests to the database.
 * This helps to reduce the number of requests made to the database and improve performance.
 *
 * @param sdk - The AegSDK instance to use for the DataLoaders.
 * @returns - An object containing the DataLoaders for users, categories, posts, and comments.
 */
export function createDataLoaders(sdk: AegSDK) {
  const users = new DataLoader(async (userIds: readonly number[]) => {
    const users = await sdk.users.findUsersByIds(userIds as number[]);

    return users;
  });

  const categories = new DataLoader(async (categoryIds: readonly number[]) => {
    const categories = await sdk.categories.findCategoriesByIds(categoryIds as number[]);

    return categories;
  });

  const posts = new DataLoader(async (postIds: readonly number[]) => {
    const posts = await sdk.posts.findPostsByIds(postIds as number[]);

    return posts;
  });

  const comments = new DataLoader(async (commentIds: readonly number[]) => {
    const comments = await sdk.comments.findCommentsByIds(commentIds as number[]);

    return comments;
  });

  return { users, categories, posts, comments };
}
