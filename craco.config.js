const path = require('path')
const { getLoader, loaderByName } = require('@craco/craco')
const CracoAlias = require('craco-alias')

const isDevelopment = process.env.NODE_ENV === 'development'
const talismanLibsFastRefresh = process.env.TALISMAN_LIBS_FAST_REFRESH === 'true'

// Adds support for server-side rendering, minification of styles, and a nicer debugging experience
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
// In order for this plugin to work correctly, you must first replicate the following directory
// structure on your local filesystem:
//
//     .
//     ├── api
//     │   └── package.json
//     ├── api-react-hooks
//     │   └── package.json
//     ├── chaindata-js
//     │   └── package.json
//     ├── util
//     │   └── package.json
//     └── web
//         └── package.json
//
// Next, you must use `yarn link` to symlink each package into the packages which depend on it:
// (In the future we might replace this step with something automatic like yarn workspaces or lerna)
//
//     # change to chaindata-js directory
//     cd chaindata-js
//     # set up chaindata-js so it can be linked to from other packages
//     yarn link
//     # change back to parent directory
//     cd ..
//
//     # change to util directory
//     cd util
//     # set up util so it can be linked to from other packages
//     yarn link
//     # change back to parent directory
//     cd ..
//
//     # change to api directory
//     cd api
//     # set up api so it can be linked to from other packages
//     yarn link
//     # add chaindata-js linked dependency
//     yarn link @talismn/chaindata-js
//     # change back to parent directory
//     cd ..
//
//     # change to api-react-hooks directory
//     cd api-react-hooks
//     # set up api-react-hooks so it can be linked to from other packages
//     yarn link
//     # add api linked dependency
//     yarn link @talismn/api
//     # add chaindata-js linked dependency
//     yarn link @talismn/chaindata-js
//     # add util linked dependency
//     yarn link @talismn/util
//     # change back to parent directory
//     cd ..
//
//     # change to web directory
//     cd web
//     # add api-react-hooks linked dependency
//     yarn link @talismn/api-react-hooks
//     # add api linked dependency
//     yarn link @talismn/api
//     # add chaindata-js linked dependency
//     yarn link @talismn/chaindata-js
//     # add util linked dependency
//     yarn link @talismn/util
//     # change back to parent directory
//     cd ..
//
// Finally, you must remove the duplicate copies of react from api-react-hooks and util
// as having two copies of react in the one workspace breaks react's hooks feature
//
//     rm -rf api-react-hooks/node_modules/react
//     ln -s ../../web/node_modules/react api-react-hooks/node_modules/
//     rm -rf util/node_modules/react
//     ln -s ../../web/node_modules/react util/node_modules/
//
const TalismanLibsFastRefreshPlugin = {
  plugin: {
    overrideWebpackConfig:
      isDevelopment && talismanLibsFastRefresh
        ? ({ webpackConfig }) => {
            const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'))

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

            console.info(
              'TalismanLibsFastRefreshPlugin: enabled\nNOTE: In order for this plugin to work correctly, you must follow the instructions in craco.config.js'
            )

            return webpackConfig
          }
        : undefined,
  },
}

module.exports = {
  plugins: [StyledComponentsPlugin, ImportAliasesPlugin, TalismanLibsFastRefreshPlugin],
}
