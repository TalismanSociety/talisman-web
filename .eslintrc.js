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
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_+$',
      },
    ],
  },
}
