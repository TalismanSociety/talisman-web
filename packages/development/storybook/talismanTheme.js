import brandImage from './brandImage.png'
import { create } from '@storybook/theming/create'

export const theme = create({
  base: 'dark',
  brandTitle: 'Talisman',
  brandUrl: 'https://talisman.xyz/',
  brandImage: brandImage,
})
