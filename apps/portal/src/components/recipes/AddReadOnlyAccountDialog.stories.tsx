import { type ComponentMeta, type Story } from '@storybook/react'

import { popularAccounts } from '@/domains/accounts/consts'

import type { AddReadOnlyAccountDialogProps } from './AddReadOnlyAccountDialog'
import { AddReadOnlyAccountDialog } from './AddReadOnlyAccountDialog'

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
