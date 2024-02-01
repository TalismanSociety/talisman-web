import type { Meta, StoryObj } from '@storybook/react'
import PoolClaimPermissionForm from './PoolClaimPermissionForm'
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
  args: {},
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [permission, setPermission] = useState<'compound' | 'withdraw' | 'all' | undefined>()
    return <PoolClaimPermissionForm permission={permission} onChangePermission={setPermission} onSubmit={() => {}} />
  },
}
