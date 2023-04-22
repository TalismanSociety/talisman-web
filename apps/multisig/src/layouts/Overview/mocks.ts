import { Token } from '../../domain/chains'
import { TokenAugmented } from './Assets'
import { Transaction, TransactionType } from './Transactions'

const DOT: Token = {
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

export const mockTransactions: Transaction[] = [
  // Transactions without all approvals
  {
    hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    chainId: 1,
    approvals: {
      '0x1234abcd5678efgh9012ijkl3456mnop': false,
      '0x2345bcde6789fghi0123jklm4567nopq': true,
    },
    decoded: {
      type: TransactionType.MultiSend,
      outgoingToken: {
        token: DOT,
        amount: 500,
        price: 30,
      },
      recipients: [
        ['0xabcdef1234567890abcdef1234567890abcdef12', 100],
        ['0xbcdefa2345678901bcdefa2345678901bcdefa2', 200],
        ['0xcdefab3456789012cdefab3456789012cdefab3', 300],
      ],
    },
    raw: '0x...',
  },
  {
    hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a',
    chainId: 1,
    approvals: {
      '0x3456cdef7890ghij1234klmn5678opqr': false,
    },
    decoded: {
      type: TransactionType.Transfer,
      outgoingToken: {
        token: DOT,
        amount: 0.5,
        price: 30,
      },
    },
    raw: '0x...',
  },
  {
    hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b',
    chainId: 1,
    approvals: {
      '0x4567defg8901hijk2345lmno6789pqrst': false,
      '0x5678efgh9012ijkl3456mnop7890qrstu': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      outgoingToken: {
        token: DOT,
        amount: 100,
        price: 30,
      },
    },
    raw: '0x...',
  },
  {
    hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c',
    chainId: 1,
    approvals: {
      '0x6789fghi0123jklm4567nopq8901rstu': true,
      '0x7890ghij1234klmn5678opqr9012stuv': true,
    },
    decoded: {
      type: TransactionType.MultiSend,
      outgoingToken: {
        token: DOT,
        amount: 1000,
        price: 30,
      },
      recipients: [
        ['0xdefabc1234567890defabc1234567890defabc1', 150],
        ['0xefabcd2345678901efabcd2345678901efabcd2', 250],
        ['0xfabcde3456789012fabcde3456789012fabcde3', 350],
      ],
    },
    raw: '0x...',
  },
  {
    hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
    chainId: 1,
    approvals: {
      '0x8901hijk2345lmno6789pqrst0123tuvw': true,
      '0x9012ijkl3456mnop7890qrst1234uvwx': true,
    },
    decoded: {
      type: TransactionType.Transfer,
      outgoingToken: {
        token: DOT,
        amount: 50,
        price: 30,
      },
    },
    raw: '0x...',
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
      free: 325206,
      locked: 0,
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
      free: 420,
      locked: 0,
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
      free: 42.69,
      locked: 0,
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
      free: 125000,
      locked: 0,
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
      free: 13.88799,
      locked: 42069,
    },
    price: 0.08,
  },
]
