import { ComponentMeta, Story } from '@storybook/react'
import { Select } from '@talismn/ui'

import StakeForm, { StakeFormProps } from './StakeForm'

export default {
  title: 'Recipes/StakeForm',
  component: StakeForm,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StakeForm>

export const Default: Story<StakeFormProps & { showExistingPool: boolean }> = ({ showExistingPool, ...args }) => (
  <div css={{ width: '40rem' }}>
    <StakeForm {...args} existingPool={showExistingPool ? args.existingPool : undefined} />
  </div>
)

Default.args = {
  assetSelector: (
    <Select width="100%" placeholder="DOT">
      <Select.Item headlineText="KSM" />
    </Select>
  ),
  accountSelector: (
    <Select width="100%" placeholder="Select account">
      <Select.Item headlineText="foo" />
    </Select>
  ),
  amountInput: (
    <StakeForm.AmountInput
      amount="1000"
      onChangeAmount={() => {}}
      onRequestMaxAmount={() => {}}
      fiatAmount="$0.00"
      availableToStake="3,250 KSM"
    />
  ),
  poolInfo: (
    <StakeForm.PoolInfo
      name="Bingbong pool"
      status="earning_rewards"
      totalStaked="24,054.55 DOT"
      memberCount="17"
      onRequestPoolChange={() => {}}
      chain="polkadot"
    />
  ),
  estimatedYield: <StakeForm.EstimatedYield amount="63.33 DOT / Year" fiatAmount="$369.42" />,
  stakeButton: <StakeForm.StakeButton />,
  existingPool: (
    <StakeForm.ExistingPool
      name="Bingbong pool"
      status="earning_rewards"
      amount="420.69 KSM"
      fiatAmount="$14,715.55"
      rewards="+0.124 KSM"
      rewardsFiatAmount="$2,203.74"
      claimChip={<StakeForm.ExistingPool.ClaimChip />}
      unlocks={[]}
      unlocking="1 KSM"
      unlockingFiatAmount="$1.1234"
      withdrawChip={<StakeForm.ExistingPool.WithdrawChip />}
      addButton={<StakeForm.ExistingPool.AddButton />}
      unstakeButton={<StakeForm.ExistingPool.UnstakeButton />}
    />
  ),
  showExistingPool: false,
}
