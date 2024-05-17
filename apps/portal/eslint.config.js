import recommended from '@talismn/eslint-config/react.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(...recommended, {
  rules: {
    // TODO: turn this back on
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
  },
})
