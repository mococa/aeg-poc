# Theme

This is the theme package for the repository. It contains the theme configuration and styles for all the applications, packages, and components in the repository.

## Usage

To use the package, import it in the tailwind.config.js file of the application. In its content, add the content of the package, and add it to the presets list:

```javascript
// tailwind.config.js
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
```
