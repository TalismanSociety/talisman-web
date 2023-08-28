import { type Meta, type StoryObj } from '@storybook/react'
import { addDays } from 'date-fns'
import { range } from 'lodash'
import StakeDetails from './StakeDetails'
import EmptyStakeDetails from './EmptyStakeDetails'

export default {
  title: 'Recipes/StakeDetails',
  component: StakeDetails,
} satisfies Meta<typeof StakeDetails>

type Story = StoryObj<typeof StakeDetails>

const payouts = range(0, 8).map(x => ({
  date: addDays(new Date(), x),
  amount: x + 10,
  displayAmount: `${x + 10} DOT`,
}))

export const Default: Story = {
  // TODO: https://github.com/storybookjs/storybook/issues/15954
  render: props => <StakeDetails {...props} />,
  args: {
    account: { name: 'Bing bong', address: 'foo' },
    poolName: 'Lit 🔥',
    claimButton: <StakeDetails.ClaimButton amount="1.2 DOT" />,
    addButton: <StakeDetails.AddButton />,
    unbondButton: <StakeDetails.UnbondButton />,
    withdrawButton: <StakeDetails.WithdrawButton amount="2 DOT" />,
    balance: '34234.12 DOT',
    rewards: '34234.12 DOT',
    apr: '5.5%',
    nextEraEta: '4 hours',
    last15DaysPayouts: payouts,
    mostRecentPayouts: payouts,
    unbondings: [
      { eta: '1 hour', amount: '1 DOT' },
      { eta: '2 days', amount: '2 DOT' },
    ],
  },
}

export const EmptyState = {
  render: () => <EmptyStakeDetails minJoinBond="1 DOT" onClickSimulateRewards={() => {}} onClickStake={() => {}} />,
}
