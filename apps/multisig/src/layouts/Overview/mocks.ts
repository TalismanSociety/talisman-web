import { Chain, Token, supportedChains } from '@domains/chains'
import { Transaction, TransactionType } from '@domains/multisig'
import BN from 'bn.js'

import { TokenAugmented } from './Assets'

export const DOT: Token = {
  id: 'polkadot',
  coingeckoId: 'polkadot',
  logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
  type: 'native',
  symbol: 'DOT',
  decimals: 10,
  chain: {
    id: 'polkadot',
  },
}

export const KSM: Token = {
  id: 'kusama',
  coingeckoId: 'kusama',
  logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
  type: 'native',
  symbol: 'KSM',
  decimals: 12,
  chain: {
    id: 'kusama',
  },
}

export const mockTransactions: Transaction[] = [
  // Transactions without all approvals
  {
    date: new Date(Date.parse('03 Feb 2023 08:01:06 GMT')),
    description: 'Make Remarks',
    hash: '0x003b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5D4yToYC7DqgHJ3PT7afS6FZ2X8uHzNP6Uym7ko4w4dJW8Vn': false,
      '5FSPS8eH2Xm69TjT2QZeTukw1NjnWxTgCpMnY1eaBvtykzW9': true,
    },
    decoded: {
      type: TransactionType.Advanced,
      recipients: [],
    },
    callData: '0x0102010000000000000000000000000000000000',
  },
  {
    date: new Date(Date.parse('06 Feb 2023 07:33:38 GMT')),
    description: 'Pay Feb Contributors',
    hash: '0x113b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5D4yToYC7DqgHJ3PT7afS6FZ2X8uHzNP6Uym7ko4w4dJW8Vn': false,
      '5FSPS8eH2Xm69TjT2QZeTukw1NjnWxTgCpMnY1eaBvtykzW9': true,
    },
    decoded: {
      type: TransactionType.MultiSend,
      recipients: [
        {
          address: '5Gw3s7q4Xq7kMSKU5r5BpKkULK1tMmMjNC8jZZoYJ27kLguY',
          balance: {
            token: DOT,
            amount: new BN('100').mul(new BN('10').pow(new BN('10'))),
          },
        },
        {
          address: '5CZz1FxoHm3qzPwkmxTwgQmPxL5sqkC7vZZ9Y6a1L6SugG6H',
          balance: {
            token: KSM,
            amount: new BN('200').mul(new BN('10').pow(new BN('10'))),
          },
        },
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('300').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('05 Feb 2023 17:03:00 GMT')),
    description: 'Admin Fees',
    hash: '0x123c4d5e6f7g8h9i0c1k2l3m4n5o6p7q8r9s0t1a',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5GZvM8XJYq3zCq3QrxsmoDJvJ8WpkLpDtDzzcnjXTnBZvX9Y': false,
    },
    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('5').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('04 Feb 2023 07:03:00 GMT')),
    description: 'Offsite Expenses',
    hash: '0x8c4d5e6f7g8h9i0j1a2l3m4n5o6p7q8r9s0t1a2b',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5H3sN2umuE7fDZMtYj9q3aHJQKgaPdu5MzWyp8Hh4i4FGM': false,
      '5DxqH7BqSf2Qj1DfcNNdUksctU92JjEFU6nEW8RUXSnU6gj': true,
    },

    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('100').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('06 Jan 2023 20:53:00 GMT')),
    description: 'Pay Jan Contributors',
    hash: '0x9d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5He7n5y6MXxrohUXJ1wja4C4mZj4oX9cYx4JaKmDpWK4Bm4q': true,
      '5FmDzNqnAp87dxJumDvt8MscxwxZz1Q2FBUAdFi9X8JT5pr6': true,
    },
    decoded: {
      type: TransactionType.MultiSend,
      recipients: [
        {
          address: '5Hv5RhoRz7Dnys8b1yVpLwEovwniu3r3QRCWQ7VynvRjopH7',
          balance: {
            token: DOT,
            amount: new BN('150').mul(new BN('10').pow(new BN('10'))),
          },
        },
        {
          address: '5DyV5wvvmYkbJTJU65P8B5TxwpUvNx6U5df6E5oAYyTFzs6y',
          balance: {
            token: DOT,
            amount: new BN('250').mul(new BN('10').pow(new BN('10'))),
          },
        },
        {
          address: '5EYxYPZscKzZ1Q2eLLXC9X9Q8WgScT33TzHkRiLhSg8n1Dox',
          balance: {
            token: DOT,
            amount: new BN('350').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('05 Jan 2023 02:10:00 GMT')),
    description: 'Kitty Litter',
    hash: '0xx06f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5FZ1nHXiU9C6yW8Fyry6CQYQwDJKKkdnt1xGxvsJ7M1TPvYX': true,
      '5FqW7g8LvnRTEH7R6QxR1Ef8WzKX2rEiVzP6nT8pW7mFjKf1': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('980388').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('05 Jan 2023 02:10:00 GMT')),
    description: 'Paying off mum',
    hash: '0xz06f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5FZ1nHXiU9C6yW8Fyry6CQYQwDJKKkdnt1xGxvsJ7M1TPvYX': true,
      '5FqW7g8LvnRTEH7R6QxR1Ef8WzKX2rEiVzP6nT8pW7mFjKf1': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('138').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('04 Jan 2023 02:10:00 GMT')),
    description: 'Pokies',
    hash: '0x096f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5FZ1nHXiU9C6yW8Fyry6CQYQwDJKKkdnt1xGxvsJ7M1TPvYX': true,
      '5FqW7g8LvnRTEH7R6QxR1Ef8WzKX2rEiVzP6nT8pW7mFjKf1': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('56').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
  {
    date: new Date(Date.parse('04 Jan 2023 02:10:00 GMT')),
    description: 'Salary March',
    hash: '0xg06f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
    chain: supportedChains.find(chain => chain.id === 'polkadot') as Chain,
    approvals: {
      '5FZ1nHXiU9C6yW8Fyry6CQYQwDJKKkdnt1xGxvsJ7M1TPvYX': true,
      '5FqW7g8LvnRTEH7R6QxR1Ef8WzKX2rEiVzP6nT8pW7mFjKf1': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      recipients: [
        {
          address: '5Ejg6Uzj6rgZbUNU17ThFqQEfurq3jf6pU6VuRdq6JkU6FT8',
          balance: {
            token: DOT,
            amount: new BN('1139099').mul(new BN('10').pow(new BN('10'))),
          },
        },
      ],
    },
    callData: '0x0000',
  },
]

export const mockTokensAugmented: TokenAugmented[] = [
  {
    details: {
      id: 'para',
      coingeckoId: 'para',
      logo: 'https://i.imgur.com/bDMbwM7.png',
      type: 'custom',
      symbol: 'PARA',
      decimals: 18,
      chain: {
        id: 'statemint',
      },
    },
    balance: {
      avaliable: 325206,
      unavaliable: 0,
    },
    price: 2.15,
  },
  {
    details: {
      id: 'polkadot',
      coingeckoId: 'polkadot',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
      type: 'native',
      symbol: 'DOT',
      decimals: 10,
      chain: {
        id: 'polkadot',
      },
    },
    balance: {
      avaliable: 420,
      unavaliable: 0,
    },
    price: 6.128,
  },
  {
    details: {
      id: 'kusama',
      coingeckoId: 'kusama',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
      type: 'native',
      symbol: 'KSM',
      decimals: 12,
      chain: {
        id: 'kusama',
      },
    },
    balance: {
      avaliable: 42.69,
      unavaliable: 0,
    },
    price: 400.21,
  },
  {
    details: {
      id: 'ausd',
      coingeckoId: 'ausd',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/ausd.svg',
      type: 'stablecoin',
      symbol: 'aUSD',
      decimals: 18,
      chain: {
        id: 'acala',
      },
    },
    balance: {
      avaliable: 125000,
      unavaliable: 0,
    },
    price: 1.0,
  },
  {
    details: {
      id: 'acala',
      coingeckoId: 'ausd',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/acala.svg',
      type: 'stablecoin',
      symbol: 'ACA',
      decimals: 18,
      chain: {
        id: 'acala',
      },
    },
    balance: {
      avaliable: 13.88799,
      unavaliable: 42069,
    },
    price: 0.08,
  },
]
