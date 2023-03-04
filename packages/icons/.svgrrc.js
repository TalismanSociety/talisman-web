module.exports = {
  outDir: 'src/components',
  typescript: true,
  prettier: true,
  ref: true,
  template: require('./template'),
  svgProps: {
    width: '{props.size ?? 24}',
    height: '{props.size ?? 24}',
  },
}
