/* ---------- Models ---------- */
import { Models } from "@aeg-poc/models";

/**
 * @description
 * Categories class for managing category-related operations.
 */
export class Categories {
  constructor() {
    console.log("Categories class instantiated");
  }

  /**
   * @description
   * Finds a category by its ID.
   *
   * @param id Category ID
   * @returns {Models.Category} Category if found, otherwise throws an error
   * @throws Error if category ID is invalid or category not found
   */
  findCategoryById(id: number): Models.Category {
    if (id <= 0) {
      throw new Error("Invalid category ID");
    }

    if (id > 1) {
      throw new Error("Category not found");
    }

    // Simulate a category lookup in the database
    const category = {
      id,
      name: "Sample Category",
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Category.deserialize(category);

    return category as unknown as Models.Category;
  }

  /**
   * @description
   * Finds a category by its name.
   *
   * @param name Category's name
   * @returns {Models.Category} Category if found, otherwise throws an error
   * @throws Error if category name is invalid or category not found
   */
  findCategoryByName(name: string): Models.Category {
    if (!name) {
      throw new Error("Invalid category name");
    }

    if (name !== "Sample Category") {
      throw new Error("Category not found");
    }

    // Simulate a category lookup in the database
    const category = {
      id: 1,
      name,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Category.deserialize(category);

    return category as unknown as Models.Category;
  }

  /**
   * @description
   * Finds all categories.
   *
   * @returns {Models.Category[]} Array of categories
   */
  findAllCategories(): Models.Category[] {
    // Simulate a category lookup in the database
    const categories = [
      {
        id: 1,
        name: "Sample Category 1",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
      {
        id: 2,
        name: "Sample Category 2",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      },
    ];

    // Deserialize each category
    for (const category of categories) {
      Models.Category.deserialize(category);
    }

    return categories as unknown as Models.Category[];
  }

  /**
   * @description
   * Creates a new category.
   *
   * @param name Category's name
   * @returns {Models.Category} Newly created category
   */
  createCategory(name: string): Models.Category {
    if (!name) {
      throw new Error("Invalid category name");
    }

    // Simulate a category creation in the database
    const category = {
      id: 1,
      name,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    Models.Category.deserialize(category);

    return category as unknown as Models.Category;
  }

  /**
   * @description
   * Updates a category.
   *
   * @param id Category ID
   * @param name Category's new name
   * @returns {Models.Category} Updated category
   */
  updateCategory(id: number, name: string): Models.Category {
    if (id <= 0) {
      throw new Error("Invalid category ID");
    }
    if (!name) {
      throw new Error("Invalid category name");
    }
    // Simulate a category update in the database
    const category = {
      id,
      name,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };
    Models.Category.deserialize(category);
    return category as unknown as Models.Category;
  }

  /**
   * @description
   * Deletes a category.
   *
   * @param id Category ID
   * @throws Error if category ID is invalid or category not found
   */
  deleteCategory(id: number): void {
    if (id <= 0) {
      throw new Error("Invalid category ID");
    }
    // Simulate a category deletion in the database
    console.log(`Category with ID ${id} deleted`);
  }
}
