import eslint from '@eslint/js'
import prettierEsLintRecommended from 'eslint-plugin-prettier/recommended'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./src/tsconfig.json'],
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['.idea', '.yarn', 'dist', '.prettierrc.js'],
  },
  prettierEsLintRecommended,
)
