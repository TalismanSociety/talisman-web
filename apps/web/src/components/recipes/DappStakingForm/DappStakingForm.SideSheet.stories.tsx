import { type Meta, type StoryObj } from '@storybook/react'
import DappStakingForm, { DappStakingSideSheet } from './DappStakingForm'
import { Default as DappStakingFormDefault } from './DappStakingForm.stories'

export default {
  title: 'Recipes/DappStakingForm/SideSheet',
  component: DappStakingSideSheet,
} satisfies Meta<typeof DappStakingSideSheet>

type Story = StoryObj<typeof DappStakingSideSheet>

export const Default: Story = {
  args: {
    children: <DappStakingForm {...(DappStakingFormDefault.args as any)} />,
    chainName: 'Astar',
    rewards: '10%',
    nextEraEta: '1 hour',
    minimumStake: '5 ASTAR',
    unbondingPeriod: '10 days',
  },
}
