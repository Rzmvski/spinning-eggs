import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([{
  extends: compat.extends(
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ),

  plugins: {
    react,
    typescriptEslint,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.commonjs,
    },

    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },

  settings: {
    react: {
      version: 'detect',
    },

    'import/resolver': {
      node: {
        paths: ['.'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/triple-slash-reference': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
  },
}]);