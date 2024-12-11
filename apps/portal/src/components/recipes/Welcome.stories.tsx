import { type ComponentMeta, type Story } from '@storybook/react'

import type { WelcomeProps } from './Welcome'
import { Welcome } from './Welcome'

export default {
  title: 'Recipes/Welcome',
  component: Welcome,
} as ComponentMeta<typeof Welcome>

export const Default: Story<WelcomeProps> = args => <Welcome {...args} />

Default.args = {
  walletButton: <Welcome.WalletButton />,
  addressInput: <Welcome.AddressInput />,
  addressInputConfirmButton: <Welcome.AddressInputConfirmButton />,
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
