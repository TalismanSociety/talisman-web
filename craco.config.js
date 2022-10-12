const CracoAlias = require('craco-alias')

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
    unsafeAllowModulesOutsideOfSrc: true,
  },
}

module.exports = {
  babel: {
    presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
    plugins: [
      '@emotion/babel-plugin',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object',
    ],
  },
  webpack: {
    configure: {
      module: {
        rules: [
          // https://polkadot.js.org/docs/usage/FAQ/#on-webpack-4-i-have-a-parse-error-on-importmetaurl
          {
            test: /\.js$/,
            loader: require.resolve('@open-wc/webpack-import-meta-loader'),
          },
        ],
      },
    },
  },
  plugins: [ImportAliasesPlugin],
}
