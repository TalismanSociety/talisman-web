import { ComponentMeta, Story } from '@storybook/react'

import StakingInput, { StakingInputProps } from './StakingInput'
import StakingInputSkeleton from './StakingInput.skeleton'

export default {
  title: 'Recipes/StakingInput',
  component: StakingInput,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StakingInput>

export const Default: Story<StakingInputProps> = args => <StakingInput {...args} />

Default.args = {
  accounts: [
    {
      name: 'Polkadot.js Import',
      address: '5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP',
      balance: '420 DOT',
    },
    {
      name: 'Yeet Account',
      address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs',
      balance: '35 DOT',
    },
    {
      name: 'My Porkydot Account',
      address: '1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS',
      balance: '2,443.33 DOT',
    },
  ],
  amount: '',
  fiatAmount: '$4,261.23',
  availableToStake: '420 DOT',
  poolName: 'Bingbong pool',
  poolTotalStaked: '24,054.55 DOT',
  poolMemberCount: '17',
}

export const AlreadyStaking = Default.bind({})

AlreadyStaking.args = { ...Default.args, alreadyStaking: true }

export const NoPoolsAvailable = Default.bind({})

NoPoolsAvailable.args = { ...Default.args, noPoolsAvailable: true }

export const Skeleton = () => <StakingInputSkeleton />
