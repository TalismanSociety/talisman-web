module.exports = {
  extends: ['@talismn', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
  },
}
