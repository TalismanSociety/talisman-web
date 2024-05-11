module.exports = {
  outDir: 'src/components',
  typescript: true,
  ref: true,
  replaceAttrValues: {
    '#000': 'currentcolor',
    '#121212': 'currentcolor',
    black: 'currentcolor',
  },
  template: require('./template'),
  svgProps: {
    display: 'inline',
    width: '{props.size ?? iconContext.size ?? "1em"}',
    height: '{props.size ?? iconContext.size ?? "1em"}',
  },
}
