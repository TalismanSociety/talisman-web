module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  babel: async options => ({
    ...options,
    presets: [
      ...options.presets,
      // HACK: Storybook includes `@babel/preset-react` by default, which
      // overrides the custom preset configuration in `babel.config.json`.
      // This override overrides the override.
      ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }, 'preset-jsx-import-source'],
    ],
  }),
}
