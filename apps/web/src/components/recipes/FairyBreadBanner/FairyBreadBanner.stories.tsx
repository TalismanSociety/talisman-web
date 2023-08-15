import { type ComponentMeta, type Story } from '@storybook/react'

import FairyBreadBanner, { type FairyBreadBannerProps } from './FairyBreadBanner'

export default {
  title: 'Recipes/FairyBreadBanner',
  component: FairyBreadBanner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof FairyBreadBanner>

export const Default: Story<FairyBreadBannerProps> = args => <FairyBreadBanner {...args} />

Default.args = {
  visible: true,
}
