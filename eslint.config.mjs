import recommended from '@talismn/eslint-config/react.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(...recommended, {
  rules: {
    // TODO: turn this back on
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true, varsIgnorePattern: '^_' },
    ],
    'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)' }],
    'react/prop-types': 'off',
  },
})
