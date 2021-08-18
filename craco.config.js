const path = require('path')
const CracoAlias = require('craco-alias')

const StyledComponentsPlugin = {
  plugin: {
    overrideCracoConfig: ({ cracoConfig }) => {
      if (!cracoConfig.babel) cracoConfig.babel = {}
      if (!Array.isArray(cracoConfig.babel.plugins)) cracoConfig.babel.plugins = []

      cracoConfig.babel.plugins.push('babel-plugin-styled-components')

      return cracoConfig
    },
  },
}

// Provides a number of @<ident> import aliases to the contents of the `src` directory
//
// Before:
// import MyComponent from '../../components/MyComponent'
//
// After:
// import MyComponent from '@components/MyComponent'
//
const ImportAliasesPlugin = {
  plugin: CracoAlias,
  options: {
    source: 'tsconfig',
    baseUrl: './src',
    tsConfigPath: './tsconfig.paths.json',
  },
}

module.exports = {
  plugins: [StyledComponentsPlugin, ImportAliasesPlugin],
}
