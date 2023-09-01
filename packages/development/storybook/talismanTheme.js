import { create } from '@storybook/theming/create'

import brandImage from './brandImage.png'

export const theme = create({
  base: 'dark',
  brandTitle: 'Talisman',
  brandUrl: 'https://talisman.xyz/',
  brandImage: brandImage,
})
