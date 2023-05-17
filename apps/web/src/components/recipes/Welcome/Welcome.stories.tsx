import { type ComponentMeta, type Story } from '@storybook/react'

import Welcome, { type WelcomeProps } from './Welcome'
import AccountConnectionDialog from '.'

export default {
  title: 'Recipes/Welcome',
  component: Welcome,
} as ComponentMeta<typeof Welcome>

export const Default: Story<WelcomeProps> = args => <Welcome {...args} />

Default.args = {
  walletButton: <Welcome.WalletButton variant="connect" />,
  addressInput: <AccountConnectionDialog.AddressInput />,
  addressInputConfirmButton: <AccountConnectionDialog.AddressInputConfirmButton />,
  popularAccounts: (
    <>
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
      <Welcome.PopularAccount address="16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD" name="Rich boy" />
    </>
  ),
}
