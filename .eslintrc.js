module.exports = {
  root: true,
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    'jest': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'semi': ['warn', 'never'],
    'comma-dangle': ['off'],
    'indent': ['error', 2],
    'function-call-argument-newline': ['off'],
    'dot-notation': ['off'],
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-no-target-blank': ['off'],
    'jsx-a11y/media-has-caption': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/no-static-element-interactions': ['off'],
    'jsx-a11y/anchor-is-valid': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/no-var-requires': ['off'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
  },
  overrides: [{
    files: ['*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-non-null-assertion': ['off'],
    }
  }]
}
