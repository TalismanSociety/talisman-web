import { create } from '@storybook/theming'

import brandImage from './brandImage.png'

const theme = create({
  base: 'dark',
  brandTitle: 'Talisman',
  brandUrl: 'https://talisman.xyz/',
  brandImage: brandImage,
})

export default theme
