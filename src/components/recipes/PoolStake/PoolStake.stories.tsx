import { ComponentMeta } from '@storybook/react'

import PoolStake from './PoolStake'

export default {
  title: 'Recipes/PoolStake',
  component: PoolStake,
  argTypes: {
    accountName: {
      defaultValue: 'Yeet Account',
    },
    accountAddress: {
      default: '(13Kcw...ZQ4K)',
    },
    stakingAmount: {
      defaultValue: '4000 DOT',
    },
    stakingAmountInFiat: {
      defaultValue: '$23,988.55',
    },
    rewardsAmount: {
      defaultValue: '+4 DOT',
    },
    rewardsAmountInFiat: {
      defaultValue: '+$120.55',
    },
    poolName: {
      defaultValue: 'Talisman Paraverse Pool',
    },
  },
} as ComponentMeta<typeof PoolStake>

export const Default = (args: any) => <PoolStake {...args} />
