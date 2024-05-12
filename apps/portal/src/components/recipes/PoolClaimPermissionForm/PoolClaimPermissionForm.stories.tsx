import PoolClaimPermissionForm from './PoolClaimPermissionForm'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

export default {
  title: 'Recipes/PoolClaimPermissionForm',
  component: PoolClaimPermissionForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PoolClaimPermissionForm>

type Story = StoryObj<typeof PoolClaimPermissionForm>

export const Default: Story = {
  args: {
    isTalismanPool: false,
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [permission, setPermission] = useState<'compound' | 'withdraw' | 'all' | undefined>()
    return (
      <PoolClaimPermissionForm
        {...args}
        permission={permission}
        onChangePermission={setPermission}
        onSubmit={() => {}}
      />
    )
  },
}
