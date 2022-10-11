import { ComponentMeta } from '@storybook/react'

import StakingInput from './StakingInput'

export default {
  title: 'Recipes/StakingInput',
  component: StakingInput,
  argTypes: {
    accounts: {
      defaultValue: [
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
    },
    amount: {
      defaultValue: '',
    },
    fiatAmount: {
      defaultValue: '$4,261.23',
    },
    availableToStake: {
      defaultValue: '420 DOT',
    },
    poolName: {
      defaultValue: 'Bingbong pool',
    },
    poolTotalStaked: {
      defaultValue: '24,054.55 DOT',
    },
    poolMemberCount: {
      defaultValue: '17',
    },
  },
} as ComponentMeta<typeof StakingInput>

export const Default = (args: any) => <StakingInput {...args} />
