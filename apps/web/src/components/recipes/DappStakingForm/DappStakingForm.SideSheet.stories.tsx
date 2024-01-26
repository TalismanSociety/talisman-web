import { type Meta, type StoryObj } from '@storybook/react'
import DappStakingForm, { DappStakingFormSideSheet } from './DappStakingForm'
import { Default as DappStakingFormDefault } from './DappStakingForm.stories'

export default {
  title: 'Recipes/DappStakingForm/SideSheet',
  component: DappStakingFormSideSheet,
} satisfies Meta<typeof DappStakingFormSideSheet>

type Story = StoryObj<typeof DappStakingFormSideSheet>

export const Default: Story = {
  args: {
    children: <DappStakingForm {...(DappStakingFormDefault.args as any)} />,
    chainName: 'Astar',
    minimumStake: '5 ASTAR',
    unbondingPeriod: '10 days',
  },
}
