const webpack = require('webpack')

module.exports = {
  babel: {
    presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
    plugins: ['@emotion/babel-plugin'],
  },
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          'crypto': require.resolve('crypto-browserify'),
          'stream': require.resolve('stream-browserify'),
          'process/browser': require.resolve('process/browser'),
        },
      },
    },
  },
  plugins: [
    {
      plugin: require('react-app-alias').CracoAliasPlugin,
      options: {
        tsconfig: 'tsconfig.paths.json',
      },
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
            ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
          )
          webpackConfig.resolve.plugins.splice(scopePluginIndex, 1)
          return webpackConfig
        },
      },
    },
  ],
}
