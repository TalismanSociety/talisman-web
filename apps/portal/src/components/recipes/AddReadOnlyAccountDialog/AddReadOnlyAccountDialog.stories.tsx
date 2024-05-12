import { popularAccounts } from '../../../domains/accounts/consts'
import AddReadOnlyAccountDialog, { type AddReadOnlyAccountDialogProps } from './AddReadOnlyAccountDialog'
import { type ComponentMeta, type Story } from '@storybook/react'

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
  popularAccounts: (
    <>
      {popularAccounts.map(x => (
        <AddReadOnlyAccountDialog.PopularAccount
          key={x.address}
          address={x.address}
          name={x.name ?? ''}
          description={x.description}
        />
      ))}
    </>
  ),
}
