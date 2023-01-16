import { ComponentMeta, Story } from '@storybook/react'

import CookieBanner, { CookieBannerProps } from './CookieBanner'

export default {
  title: 'Recipes/CookieBanner',
  component: CookieBanner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof CookieBanner>

export const Default: Story<CookieBannerProps> = args => <CookieBanner {...args} />
