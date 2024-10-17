import DappStakingForm from './DappStakingForm'
import { type Meta, type StoryObj } from '@storybook/react'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/DappStakingForm',
  component: DappStakingForm,
} satisfies Meta<typeof DappStakingForm>

type Story = StoryObj<typeof DappStakingForm>

export const Default: Story = {
  args: {
    accountSelector: (
      <Select css={{ width: '100%' }} placeholder="Select account">
        <Select.Option headlineContent="foo" />
      </Select>
    ),
    amountInput: (
      <DappStakingForm.AmountInput
        amount="2 ASTAR"
        isLoading={false}
        fiatAmount="$1.00"
        availableToStake="1 ASTAR"
        onChangeAmount={() => {}}
        onRequestMaxAmount={() => {}}
        assetSelector={
          <Select placeholder="DOT">
            <Select.Option headlineContent="ASTAR" />
          </Select>
        }
      />
    ),
    selectedDappName: 'Talisman Portal',
    selectedDappLogo:
      'https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/collections%2FDcs3btJSMUg5Al36ckpm%2Ficon%2FA9YrhMPNYCFEGw78veFN%2Ftalisman_icon_red.svg?alt=media&token=50981c0a-a3c6-453c-8a2a-4f61bd93f426',
    estimatedRewards: '0.021 ASTR / Year ($23.04)',
    currentStakedBalance: '2 ASTAR',
    stakeButton: <DappStakingForm.StakeButton />,
  },
}
