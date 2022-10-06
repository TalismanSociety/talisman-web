const path = require('path')
const { getLoader, loaderByName } = require('@craco/craco')
const CracoAlias = require('craco-alias')

const isDevelopment = process.env.NODE_ENV === 'development'
const talismanLibsFastRefresh = process.env.TALISMAN_LIBS_FAST_REFRESH === 'true'

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

// Fixes the following error on `yarn start`:
//
//     Failed to compile.
//
//     ./node_modules/@polkadot/x-global/packageInfo.js 6:27
//     Module parse failed: Unexpected token (6:27)
//     File was processed with these loaders:
//      * ./node_modules/babel-loader/lib/index.js
//     You may need an additional loader to handle the result of these loaders.
//     | export const packageInfo = {
//     |   name: '@polkadot/x-global',
//     >   path: new URL('.', import.meta.url).pathname,
//     |   type: 'esm',
//     |   version: '8.3.3'
//
// Solution comes from https://polkadot.js.org/docs/usage/FAQ/#on-webpack-4-i-have-a-parse-error-on-importmetaurl
const ImportMetaLoaderPlugin = {
  plugin: {
    overrideWebpackConfig: ({ webpackConfig }) => {
      if (!webpackConfig.module) webpackConfig.module = { rules: [] }
      if (!webpackConfig.module.rules) webpackConfig.module.rules = []
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      })

      return webpackConfig
    },
  },
}

// Adds a number of talisman library dependencies to the list of babel-loader include paths
//
// The aim of this plugin is to vastly improve the development experience when working on
// this app and its dependencies at the same time.
//
// Without this plugin, any change made to a @talismn/* dependency would require you to:
//   1. Rebuild the dependency (e.g. from typescript to commonjs)
//   2. Restart the webpack dev server
//
// With this plugin, you can edit the dependency's source and immediately have it rebuilt
// and hot loaded into the running webpack session.
//
// Enabled by setting the env variable TALISMAN_LIBS_FAST_REFRESH=true
// For example:
//
//     TALISMAN_LIBS_FAST_REFRESH=true yarn start
//
// In order for this plugin to work correctly, you must first set up and link your talisman workspace.
// Follow the instructions at https://github.com/TalismanSociety/workspace#readme to get started.
//
const TalismanLibsFastRefreshPlugin = {
  plugin: {
    overrideWebpackConfig:
      isDevelopment && talismanLibsFastRefresh
        ? ({ webpackConfig }) => {
            const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'))

            // Add dependencies to babel-loader
            if (isFound) {
              const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include]

              const packages = [
                path.join(__dirname, '../api'),
                path.join(__dirname, '../api-react-hooks'),
                path.join(__dirname, '../chaindata-js'),
                path.join(__dirname, '../util'),
              ]

              match.loader.include = include.concat(packages)
            }

            // Fix react duplicates error: https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
            // Solution from: https://github.com/facebook/create-react-app/issues/3547#issuecomment-668842318
            webpackConfig.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react')
            webpackConfig.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom')

            console.info(
              'TalismanLibsFastRefreshPlugin: enabled\nNOTE: In order for this plugin to work correctly, you must follow the instructions in craco.config.js'
            )

            return webpackConfig
          }
        : undefined,
  },
}

module.exports = {
  babel: {
    presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
    plugins: [
      '@emotion/babel-plugin',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-property-in-object',
    ],
  },
  plugins: [ImportAliasesPlugin, ImportMetaLoaderPlugin, TalismanLibsFastRefreshPlugin],
}
