module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'import/no-cycle': 'warn',
    'react/jsx-key': 'warn',
  },
}
