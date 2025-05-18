/** @type {import('prettier').Config} */
export default {
  // Add semicolons at the end of statements
  semi: true,

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Wrap lines at 100 characters
  printWidth: 100,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Add trailing commas in objects, arrays, etc. when they span multiple lines (ES5 compatible)
  trailingComma: 'es5',

  // Add spaces between brackets in object literals
  bracketSpacing: true,

  // Avoid parentheses around a sole arrow function parameter when possible
  arrowParens: 'avoid',

  // Prettier plugins
  plugins: [
    /**
     *
     * prettier-plugin-packagejson - Sorts package.json fields according to npm documentation and conventional standards. Alphabetizes dependencies.
     *
     */
    'prettier-plugin-packagejson',
    /**
     *
     * @trivago/prettier-plugin-sort-imports - Sorts imports in a consistent order. This plugin is useful for maintaining a clean and organized import structure in your codebase.
     *
     */
    '@trivago/prettier-plugin-sort-imports',
  ],
  /**
   * importOrder - Specifies the order in which imports should be sorted.
   */
  importOrder: [
    '^eslint',
    '^@eslint/(.*)$',
    '^react(.*)$',
    '^next/(.*)$',
    '^react-hook-form/(.*)$',
    '^zod(.*)$',
    '^next-safe-action(.*)$',
    '^better-auth(.*)$',
    '^@hookform/resolvers/(.*)$',
    '^@mantine/core(.*)$',
    '^@mantine/hooks(.*)$',
    '^@mantine/charts(.*)$',
    '^@tabler/icons-react(.*)$',
    '^~/db(.*)$',
    '^~/lib(.*)$',
    '^~/(.*)$',
    '^[^.]',
    '^[./]',
  ],
  /**
   * importOrderSeparation - Ensures that there is a blank line between different groups of imports.
   * This helps to visually separate different categories of imports, making the code more readable.
   */
  importOrderSeparation: true,
  /**
   * importOrderSortSpecifiers - Sorts the specifiers within each import statement.
   * This means that if you have multiple imports from the same module,
   * they will be sorted alphabetically. This helps to maintain a consistent order of imports.
   */
  importOrderSortSpecifiers: true,
};
