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
}

export const Eligible = Default.bind({})

Eligible.args = {
  open: true,
  fastUnstakeEligibility: 'eligible',
}

export const Ineligible = Default.bind({})

Ineligible.args = {
  open: true,
  fastUnstakeEligibility: 'ineligible',
}
