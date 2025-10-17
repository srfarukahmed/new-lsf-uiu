import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      '.env',
    ],
  },

  {
    rules: {
      // Add your custom rules here, for example:
      'no-console': 'warn', // Warn on console statements
      semi: ['error', 'always'], // Require semicolons
      quotes: ['error', 'single'], // Enforce single quotes
      indent: ['error', 2], // Enforce 2-space indentation
      '@typescript-eslint/no-unused-vars': 'error',
      // to enforce using type for object type definitions, can be type or interface
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    files: ['src/server.ts'], // Adjust the file path as necessary
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: [
      'src/app/middleware/globalErrorhandler.ts',
      'src/app/middleware/notFound.ts',
    ], // Adjust the file path as necessary
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
