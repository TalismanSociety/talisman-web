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

const babel = {
  presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
  plugins: [
    '@emotion/babel-plugin',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}

module.exports = {
  babel,
  webpack: {
    configure: {
      module: {
        rules: [
          // https://polkadot.js.org/docs/usage/FAQ/#on-webpack-4-i-have-a-parse-error-on-importmetaurl
          {
            test: /\.js$/,
            // TODO: storybook need babel-loader for some reason
            use: process.env.STORYBOOK
              ? [
                  require.resolve('@open-wc/webpack-import-meta-loader'),
                  {
                    loader: 'babel-loader',
                    options: babel,
                  },
                ]
              : [require.resolve('@open-wc/webpack-import-meta-loader')],
          },
          // TODO: remove once upgrade to `react-scripts` version 5
          { test: /\.mjs$/, type: 'javascript/auto' },
        ],
      },
    },
  },
  plugins: [ImportAliasesPlugin],
}
