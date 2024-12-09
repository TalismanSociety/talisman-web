import recommended from '@talismn/eslint-config/react.js'
import tseslint from 'typescript-eslint'

const ignores = ['src/components/widgets/xcm/api/utils/xcm-cfg-builders/builders']

export default tseslint.config({ ignores }, ...recommended, {
  rules: {
    'react/prop-types': 'off',
  },
})
