import { type ComponentMeta, type Story } from '@storybook/react'

import CookieBanner, { type CookieBannerProps } from './CookieBanner'

export default {
  title: 'Recipes/CookieBanner',
  component: CookieBanner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof CookieBanner>

export const Default: Story<CookieBannerProps> = args => <CookieBanner {...args} />

Default.args = {
  visible: true,
}
