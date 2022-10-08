module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:testing-library/react', 'plugin:storybook/recommended'],
  rules: {
    'import/no-cycle': 'warn',
  },
}
