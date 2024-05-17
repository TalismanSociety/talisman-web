import base from './index.js'
import { fixupPluginRules, fixupConfigRules } from '@eslint/compat'
// @ts-ignore
import reactHooks from 'eslint-plugin-react-hooks/index.js'
// @ts-ignore
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
// @ts-ignore
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...base,
  // @ts-ignore
  ...fixupConfigRules(reactRecommended),
  { languageOptions: reactJsxRuntime.languageOptions, rules: reactJsxRuntime.rules },
  {
    plugins: {
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  }
)
