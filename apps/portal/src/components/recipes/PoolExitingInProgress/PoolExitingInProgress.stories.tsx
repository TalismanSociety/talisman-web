import { type ComponentMeta, type Story } from '@storybook/react'

import PoolExitingInProgress from './PoolExitingInProgress'

export default {
  title: 'Recipes/PoolSelector',
  component: PoolExitingInProgress,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PoolExitingInProgress>

export const Default: Story = (args: any) => <PoolExitingInProgress {...args} />
