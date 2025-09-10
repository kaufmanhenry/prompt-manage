// ESLint Flat Config for Next.js + TypeScript
// - Uses ESM (mjs) to work without setting package.json "type": "module"
// - Strict but practical rules; warnings for riskier rules to avoid churn
// - Integrates Next.js core-web-vitals and TailwindCSS

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Global ignores
  {
    ignores: [
      '.next',
      '.turbo',
      'dist',
      'build',
      'coverage',
      '.vercel',
      'node_modules',
      'playwright-report',
      'test-results',
    ],
  },

  // Base JS recommendations
  js.configs.recommended,

  // Apply Next.js core-web-vitals rules
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...(nextPlugin.configs['core-web-vitals']?.rules ?? {}),
    },
  },

  // TypeScript specific settings
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TS handles undefined vars best; avoid false positives in types-only usages
      'no-undef': 'off',
      // Use TS-aware redeclare rule
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': ['error'],
      // Prefer type-only imports/exports for TS
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Catch unhandled promises; warn initially to avoid churn
      '@typescript-eslint/no-floating-promises': 'warn',

      // Clean up unused variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Gradually reduce any usage
      '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: false, ignoreRestArgs: true }],
    },
  },

  // Common rules for JS/TS (including Node-based config files)
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.cjs'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      tailwindcss,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Sorting/cleanup
      'import/order': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',

      // A11y recommendations
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      // Avoid breaking builds on placeholder blocks
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },

  // Ensure Node globals for this config file itself
  {
    files: ['eslint.config.*'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // Disable stylistic rules that Prettier handles
  prettier,
];
