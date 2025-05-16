/* ---------- Entities ---------- */
import { Categories } from "./entities/category";
import { Comments } from "./entities/comment";
import { Posts } from "./entities/post";
import { Users } from "./entities/user";

/**
 * @description
 * Main class for the SDK, providing access to all modules of the SDK.
 */
export class AegSDK {
  /**
   * @description
   * User management module.
   */
  users: Users;

  /**
   * @description
   * Comment management module.
   */
  comments: Comments;

  /**
   * @description
   * Category management module.
   */
  categories: Categories;

  /**
   * @description
   * Post management module.
   */
  posts: Posts;

  constructor() {
    this.users = new Users();
    this.comments = new Comments();
    this.categories = new Categories();
    this.posts = new Posts();
  }
}
