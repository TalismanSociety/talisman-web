import { type SlpxAddStakeDialogProps, SlpxAddStakeDialog } from './AddStakeDialog'
import { type ComponentMeta, type Story } from '@storybook/react'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/AddStakeDialog/Slpx',
  component: SlpxAddStakeDialog,
} as ComponentMeta<typeof SlpxAddStakeDialog>

export const Default: Story<SlpxAddStakeDialogProps> = args => <SlpxAddStakeDialog {...args} />

Default.args = {
  open: true,
  availableToStake: '420 GLMR',
  amount: '1 GLMR',
  fiatAmount: '$1.00',
  newAmount: '0.9 vGLMR',
  newFiatAmount: '$24926.80',
  rate: '1 MOVR = 0.861629 vMOVR',
  accountSelector: (
    <Select css={{ width: '100%' }} placeholder="Select account">
      <Select.Option headlineContent="foo" />
    </Select>
  ),
}
