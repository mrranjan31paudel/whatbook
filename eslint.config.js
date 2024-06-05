const react = require('eslint-plugin-react');
const globals = require('globals');

module.exports = [
  {
    plugins: { react },
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      quotes: ['error', 'single'],
      'arrow-parens': ['error', 'always'],
      semi: ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
    ignores: ['**/*.test.js', '**/*.css', '**/*.json', '!src/**/*.js'],
  },
];
