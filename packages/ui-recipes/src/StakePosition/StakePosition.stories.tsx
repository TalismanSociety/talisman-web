import StakePosition, { StakePositionList } from './StakePosition'
import { type Meta, type StoryObj } from '@storybook/react'

export default {
  component: StakePosition,
} satisfies Meta<typeof StakePosition>

type Story = StoryObj<typeof StakePosition>

export const Default: Story = {
  args: {
    account: { name: 'Account 1', address: 'foo' },
    chain: 'Polkadot',
    assetSymbol: 'DOT',
    assetLogoSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/polkadot.svg',
    stakeStatus: 'earning_rewards',
    provider: '🪬 Talisman Pool 1: app.talisman.xyz/staking 🪬',
    balance: '1 DOT',
    fiatBalance: '$1',
    rewards: '1 DOT',
    fiatRewards: '$1',
    increaseStakeButton: <StakePosition.IncreaseStakeButton />,
    unstakeButton: <StakePosition.UnstakeButton />,
    lockedButton: <StakePosition.LockedButton amount="45 DOT" onClick={() => {}} />,
    claimButton: <StakePosition.ClaimButton amount="2.5 DOT" />,
    withdrawButton: <StakePosition.WithdrawButton amount="45.234 DOT" />,
    menuButton: <StakePosition.MenuButton />,
  },
}

export const LargeAmount: Story = {
  args: {
    chain: 'Polkadot',
    account: { name: 'Account 1', address: 'foo' },
    assetSymbol: 'DOT',
    assetLogoSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/polkadot.svg',
    stakeStatus: 'earning_rewards',
    provider: '🪬 Talisman Pool 1: app.talisman.xyz/staking 🪬',
    balance: '1 DOT',
    fiatBalance: '$1',
    rewards: '1 DOT',
    fiatRewards: '$1',
    increaseStakeButton: <StakePosition.IncreaseStakeButton />,
    unstakeButton: <StakePosition.UnstakeButton />,
    lockedButton: <StakePosition.LockedButton amount="100,000.420 DOT" onClick={() => {}} />,
    claimButton: <StakePosition.ClaimButton amount="100,000.420 DOT" />,
    withdrawButton: <StakePosition.WithdrawButton amount="100,000.420 DOT" />,
    menuButton: <StakePosition.MenuButton />,
  },
}

export const Unstaking: Story = {
  args: {
    account: { name: 'Account 1', address: 'foo' },
    chain: 'Polkadot',
    assetSymbol: 'DOT',
    assetLogoSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/polkadot.svg',
    stakeStatus: 'earning_rewards',
    provider: '🪬 Talisman Pool 1: app.talisman.xyz/staking 🪬',
    balance: '1 DOT',
    fiatBalance: '$1',
    rewards: '1 DOT',
    fiatRewards: '$1',
    increaseStakeButton: <StakePosition.IncreaseStakeButton />,
    unstakeButton: <StakePosition.UnstakeButton />,
    lockedButton: <StakePosition.LockedButton amount=" DOT" onClick={() => {}} />,
    claimButton: <StakePosition.ClaimButton amount="1 DOT" />,
    menuButton: <StakePosition.MenuButton />,
    unstakingStatus: (
      <StakePosition.UnstakingStatus
        amount="1 DOT"
        unlocks={[
          { amount: '132 DOT', eta: '11 hours 24 minutes' },
          { amount: '14 DOT', eta: '11 hours 24 minutes' },
          { amount: '56 DOT', eta: '11 hours 24 minutes' },
        ]}
      />
    ),
  },
}

export const Multiple: Story = {
  render: () => (
    <StakePositionList>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StakePosition {...(Default.args as any)} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StakePosition {...(Default.args as any)} unstakingStatus={undefined} withdrawButton={undefined} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StakePosition {...(Default.args as any)} readonly />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StakePosition {...(Default.args as any)} unstakingStatus={undefined} statisticsButton={undefined} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StakePosition {...(LargeAmount.args as any)} />
    </StakePositionList>
  ),
}
