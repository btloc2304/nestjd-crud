// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // Đặt rõ cấu hình Prettier trong ESLint để đảm bảo đồng bộ
      'prettier/prettier': ['error', {
        tabWidth: 4,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        semi: true,
        bracketSpacing: true,
        arrowParens: 'avoid',
      }, { usePrettierrc: true }]
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'off',
      // Tắt các quy tắc định dạng ESLint có thể xung đột
      'indent': 'off',
      '@typescript-eslint/indent': 'off',
    },
  },
);
