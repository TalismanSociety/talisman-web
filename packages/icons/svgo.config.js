module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          mergePaths: false,
          // viewBox is required to resize SVGs with CSS.
          // @see https://github.com/svg/svgo/issues/1128
          removeViewBox: false,
        },
      },
    },
  ],
}
