import { Default as StakeDetails } from '@components/recipes/StakeDetails/StakeDetails.stories'
import { type Meta, type StoryObj } from '@storybook/react'
import { UnibodySelect } from '@talismn/ui'
import StakeDashboard from './StakeDashboard'

export default {
  title: 'Templates/StakeDashboard',
  component: StakeDashboard,
} satisfies Meta<typeof StakeDashboard>

type Story = StoryObj<typeof StakeDashboard>

export const Default: Story = {
  args: {
    chainSelector: <UnibodySelect placeholder="Select asset" />,
    chainCount: 3,
    accountSelector: <UnibodySelect placeholder="Select account" />,
    accountCount: 3,
    // TODO: https://github.com/storybookjs/storybook/issues/15954
    // @ts-expect-error
    details: <StakeDetails.render {...StakeDetails.args} />,
  },
}
