module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:testing-library/react',
    'plugin:storybook/recommended',

    // make sure this one comes last
    // all it does is turn off any prettier-conflicting rules
    // which the other configs might have turned on
    'eslint-config-prettier',
  ],
  rules: {
    'import/no-cycle': 'warn',
  },
}
