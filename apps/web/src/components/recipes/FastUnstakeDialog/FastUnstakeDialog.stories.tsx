import { type ComponentMeta, type Story } from '@storybook/react'

import FastUnstakeDialog, { type FastUnstakeDialogProps } from './FastUnstakeDialog'

export default {
  title: 'Recipes/FastUnstakeDialog',
  component: FastUnstakeDialog,
} as ComponentMeta<typeof FastUnstakeDialog>

export const Default: Story<FastUnstakeDialogProps> = args => <FastUnstakeDialog {...args} />

Default.args = {
  open: true,
  fastUnstakeEligibility: 'pending',
  amount: '3244.69 DOT',
  fiatAmount: '$214,544.55',
  lockDuration: '28 days',
}

export const Eligible = Default.bind({})

Eligible.args = {
  ...Default.args,
  fastUnstakeEligibility: 'eligible',
}

export const Ineligible = Default.bind({})

Ineligible.args = {
  ...Default.args,
  fastUnstakeEligibility: 'ineligible',
}
