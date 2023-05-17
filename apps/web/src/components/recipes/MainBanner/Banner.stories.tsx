import { type ComponentMeta, type Story } from '@storybook/react'

import MainBanner from './MainBanner'

export default {
  title: 'Recipes/MainBanner',
  component: MainBanner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof MainBanner>

export const Default: Story = args => <MainBanner {...args} />
