import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
// @ts-ignore
import reactHooks from 'eslint-plugin-react-hooks/index.js'
// @ts-ignore
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
// @ts-ignore
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'

import base from './index.js'

export default tseslint.config(
  ...base,
  // @ts-ignore
  ...fixupConfigRules(reactRecommended),
  { languageOptions: reactJsxRuntime.languageOptions, rules: reactJsxRuntime.rules },
  { plugins: { 'react-hooks': fixupPluginRules(reactHooks) }, rules: reactHooks.configs.recommended.rules },
  {
    settings: { react: { version: 'detect' } },
    rules: {
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)' }],
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react/prop-types': 'off',
    },
  }
)
