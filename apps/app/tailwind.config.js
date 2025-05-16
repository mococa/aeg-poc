import AegTheme from "@aeg-poc/theme";

/** @type {typeof AegTheme} */
export default {
  content: [
    "./src/**/*.jsx",
    "./src/**/*.tsx",
    ...AegTheme.content,
  ],
  presets: [AegTheme],
}
