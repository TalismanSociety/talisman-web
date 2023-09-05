import { type Meta, type StoryObj } from '@storybook/react'

import ExtrinsicDetailsSideSheet from './ExtrinsicDetailsSideSheet'

export default {
  title: 'Recipes/ExtrinsicDetailsSideSheet',
  component: ExtrinsicDetailsSideSheet,
} satisfies Meta<typeof ExtrinsicDetailsSideSheet>

type Story = StoryObj<typeof ExtrinsicDetailsSideSheet>

export const Default: Story = {
  args: {
    chain: 'Polkadot',
    id: '16682150-7',
    blockHeight: 16682150,
    hash: '0xbae40a865e1b719d7c0e076c935de340c4b9759fbb1362415e87feb33353fcd2',
    module: 'Staking',
    call: 'bond_extra',
    signer: { address: '15Lv2KKaHkCXqLvPjTYMGGV3BQMjuNJPaQiVVAbgCuEk6V5L' },
    date: new Date(),
    success: true,
    arguments: [
      {
        name: 'asset_in',
        type: 'U32',
        type_name: 'AssetId',
        value: 11,
      },
      {
        name: 'asset_out',
        type: 'U32',
        type_name: 'AssetId',
        value: 5,
      },
      {
        name: 'amount',
        type: 'U128',
        type_name: 'Balance',
        value: '2381001',
      },
      {
        name: 'min_buy_amount',
        type: 'U128',
        type_name: 'Balance',
        value: '1331997860243',
      },
    ],
    transfers: [
      {
        debit: { address: '15Lv2KKaHkCXqLvPjTYMGGV3BQMjuNJPaQiVVAbgCuEk6V5L' },
        credit: { address: '1odhHWsddwRnDQLpyKypBSNhqQbFi43RuHxVaCgeTVEcQv7' },
        amount: '500 DOT',
      },
      {
        debit: { address: '1odhHWsddwRnDQLpyKypBSNhqQbFi43RuHxVaCgeTVEcQv7' },
        credit: { address: '15Lv2KKaHkCXqLvPjTYMGGV3BQMjuNJPaQiVVAbgCuEk6V5L' },
        amount: '500 DOT',
      },
    ],
    rewards: [
      {
        debit: { address: '15Lv2KKaHkCXqLvPjTYMGGV3BQMjuNJPaQiVVAbgCuEk6V5L' },
        amount: '500 DOT',
      },
      {
        debit: { address: '1odhHWsddwRnDQLpyKypBSNhqQbFi43RuHxVaCgeTVEcQv7' },
        amount: '500 DOT',
      },
    ],
  },
}
