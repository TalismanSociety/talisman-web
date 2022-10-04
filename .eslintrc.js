module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:testing-library/react'],
  rules: {
    'import/no-cycle': 'warn',
  },
}
