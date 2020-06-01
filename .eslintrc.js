module.exports = {
  env: {
    es6: true, // gets Promise working
    jest: true,
    node: true,
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
