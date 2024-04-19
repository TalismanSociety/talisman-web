import type { Meta, StoryObj } from '@storybook/react'
import { TokenSelectDialog } from './TokenSelectDialog'

export default {
  component: TokenSelectDialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TokenSelectDialog>

type Story = StoryObj<typeof TokenSelectDialog>

export const Default: Story = {
  args: {
    chains: [
      {
        id: 'evm-0',
        name: 'Ethereum Mainnet',
        iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/usdt.svg',
      },
      {
        id: 'substrate-polkadot',
        name: 'Polkadot',
        iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/dot.svg',
      },
    ],
    tokens: [
      {
        id: 'usdc',
        code: 'USDC',
        name: 'USD Coin',
        iconSrc:
          'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/usd-coin.webp',
        chain: 'Ethereum Mainnet',
        chainId: 'evm-0',
        amount: '10 USDC',
        fiatAmount: '$10',
      },
      {
        id: 'usdt',
        code: 'USDT',
        name: 'Tether',
        iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/usdt.svg',
        chain: 'Ethereum Mainnet',
        chainId: 'evm-0',
        amount: '10 USDT',
        fiatAmount: '$10',
      },
      {
        id: 'dai',
        code: 'DAI',
        name: 'Dai',
        iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/dai.webp',
        chain: 'Ethereum Mainnet',
        chainId: 'evm-0',
        amount: '10 DAI',
        fiatAmount: '$10',
      },
      {
        id: 'dot',
        code: 'DOT',
        name: 'Polkadot',
        iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/dot.svg',
        chain: 'Polkadot',
        chainId: 'substrate-polkadot',
        amount: '10 DOT',
        fiatAmount: '$100',
      },
    ],
  },
}
