import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake'
import { ComponentMeta, Story } from '@storybook/react'

import HiddenDetails, { HiddenDetailsProps } from './HiddenDetails'

export default {
  title: 'Molecules/HiddenDetails',
  component: HiddenDetails,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof HiddenDetails>

export const Default: Story<HiddenDetailsProps> = args => <HiddenDetails {...args} />

Default.args = {
  children: (
    <PoolStakeList>
      <PoolStake.Skeleton animate={false} />
      <PoolStake.Skeleton animate={false} />
      <PoolStake.Skeleton animate={false} />
    </PoolStakeList>
  ),
  overlay: (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3.2rem',
      }}
    >
      <Text.Body>You have no staked assets yet...</Text.Body>
      <Button variant="outlined">Get started</Button>
    </div>
  ),
}
