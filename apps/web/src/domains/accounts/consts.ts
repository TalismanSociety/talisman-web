import type { ReadonlyAccount } from '.'

export const popularAccounts: Array<ReadonlyAccount & { description?: string }> = [
  { name: 'Swader', address: '5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr', description: '200+ NFTs' },
  { name: '🍺 Gav', address: '5F7LiCA6T4DWUDRQyFAWsRqVwxrJEznUtcw4WNnb5fe6snCH', description: 'Polkadot founder' },
  { name: 'Jay', address: '5DfAiCavECjh37Bdgy7q5ib7AtjJmvZDmSkVBoBXPjVWXCST', description: '$1M+ assets' },
  { name: 'Bill Laboon', address: '5HjZCeVcUVpThHNMyMBMKqN5ajph9CkDmZhn9BK48TmC3K4Y', description: '50+ Crowdloans' },
  { name: 'Vitalik.eth', address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', description: 'Vitalik Buterin' },
  { address: '0x804c4c527f3b278a1b328ebe239359e1c1008398', description: '$13M+ EVM assets' },
]
