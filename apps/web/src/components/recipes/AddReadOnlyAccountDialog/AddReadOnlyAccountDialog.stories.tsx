import { type ComponentMeta, type Story } from '@storybook/react'

import AddReadOnlyAccountDialog, { type AddReadOnlyAccountDialogProps } from './AddReadOnlyAccountDialog'

export default {
  title: 'Recipes/AddReadOnlyAccountDialog',
  component: AddReadOnlyAccountDialog,
} as ComponentMeta<typeof AddReadOnlyAccountDialog>

export const Default: Story<AddReadOnlyAccountDialogProps> = args => <AddReadOnlyAccountDialog {...args} />

Default.args = {
  open: true,
  name: 'Birdo',
  address: '1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS',
  resultingAddress: '1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS',
}
