module.exports = {
  outDir: 'src/components',
  typescript: true,
  prettier: true,
  ref: true,
  replaceAttrValues: {
    '#000': 'currentcolor',
    '#121212': 'currentcolor',
  },
  template: require('./template'),
  svgProps: {
    width: '{props.size ?? iconContext.size ?? 24}',
    height: '{props.size ?? iconContext.size ?? 24}',
  },
}
