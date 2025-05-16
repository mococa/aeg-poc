/* ---------- External ---------- */
import { dirname, join } from "path";
import type { Config } from "tailwindcss";

/**
 * @description
 * All the files that should be scanned for Tailwind CSS classes.
 * This includes all the files in the `@aeg-poc/ui` package that end with `.tsx`.
 */
const content: Config["content"] = [
  join(dirname(require.resolve("@aeg-poc/ui")), "./**/*.tsx"),
];

/**
 * @description
 * The theme configuration for Tailwind CSS.
 * This is where we tweak the colors classes, font-sizes, etc.
 */
const theme: Config["theme"] = {};

/**
 * @description
 * The plugins for Tailwind CSS.
 * This is where we can add custom plugins to extend Tailwind CSS functionality.
 */
const plugins: Config["plugins"] = [];

const config: Config = {
  content,
  theme,
  plugins,
};

export default config;
