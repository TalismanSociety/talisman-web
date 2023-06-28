import { Default as StakeDetails } from '@components/recipes/StakeDetails/StakeDetails.stories'
import { type Meta, type StoryObj } from '@storybook/react'
import { Select } from '@talismn/ui'
import StakeDashboard from './StakeDashboard'

export default {
  title: 'Templates/StakeDashboard',
  component: StakeDashboard,
} satisfies Meta<typeof StakeDashboard>

type Story = StoryObj<typeof StakeDashboard>

export const Default: Story = {
  args: {
    assetSelector: <Select placeholder="Select asset" />,
    accountSelector: <Select placeholder="Select account" />,
    // TODO: https://github.com/storybookjs/storybook/issues/15954
    // @ts-expect-error
    details: <StakeDetails.render {...StakeDetails.args} />,
  },
}
