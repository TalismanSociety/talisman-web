import recommended from '@talismn/eslint-config/react.js'
import tseslint from 'typescript-eslint'

const ignores = [
  'src/components/widgets/swap/swap-modules/stealthex.api.d.ts',
  'src/components/widgets/xcm/api/utils/xcm-cfg-builders/builders',
  'src/generated',
]

export default tseslint.config({ ignores }, ...recommended, {
  rules: {
    'react/prop-types': 'off',
  },
})
