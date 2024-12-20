type BaseChain = {
  genesisHash: `0x${string}`
}

type ChainWithNominationPools = {
  hasNominationPools: true
  priorityPool: number | number[] | undefined
  talismanPools: number[] | undefined
  novaIndexerUrl: string
}

type ChainWithDappStaking = {
  hasDappStaking: true
  dappStakingApi: string
  priorityDapp: string | undefined
}

type ChainWithSubtensorStaking = {
  hasSubtensorStaking: true
}

export type ChainConfig =
  | BaseChain
  | (BaseChain & (ChainWithNominationPools | ChainWithDappStaking | ChainWithSubtensorStaking))

export const chainConfigs: ChainConfig[] = [
  // Polkadot
  {
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    hasNominationPools: true,
    priorityPool: 282,
    talismanPools: [12, 16, 282],
    novaIndexerUrl: 'https://gateway.subquery.network/query/0x1a',
  },
  // Kusama
  {
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    hasNominationPools: true,
    priorityPool: 15,
    talismanPools: [15],
    novaIndexerUrl: 'https://gateway.subquery.network/query/0x1a',
  },
  // Astar
  {
    genesisHash: '0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6',
    hasDappStaking: true,
    dappStakingApi: 'https://api.astar.network/api/v3/astar/dapps-staking/',
    priorityDapp: 'ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg',
  },
  // Aleph0
  {
    genesisHash: '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e',
    hasNominationPools: true,
    priorityPool: 47,
    talismanPools: [47],
    novaIndexerUrl: 'https://api.subquery.network/sq/nova-wallet/nova-wallet-aleph-zero',
  },
  // Vara
  {
    genesisHash: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
    hasNominationPools: true,
    priorityPool: 8,
    talismanPools: [8],
    novaIndexerUrl: 'https://api.subquery.network/sq/nova-wallet/nova-wallet---vara',
  },
  // Avail
  {
    genesisHash: '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a',
    hasNominationPools: true,
    priorityPool: [2, 66, 68],
    talismanPools: [2, 66, 68],
    novaIndexerUrl: 'https://api.subquery.network/sq/nova-wallet/nova-wallet-avail',
  },
  // Cere
  {
    genesisHash: '0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c',
    hasNominationPools: true,
    priorityPool: [1],
    talismanPools: [1],
  },
  // Bittensor
  {
    genesisHash: '0x2f0555cc76fc2840a25a6ea3b9637146806f1f44b090c175ffde2a7e5ab36c03',
    hasSubtensorStaking: true,
  },
  // Westend
  {
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    hasNominationPools: true,
    priorityPool: undefined,
    talismanPools: undefined,
    novaIndexerUrl: 'https://api.subquery.network/sq/nova-wallet/nova-wallet-westend',
  },
  // Shibuya
  {
    genesisHash: '0xddb89973361a170839f80f152d2e9e38a376a5a7eccefcade763f46a8e567019',
    hasDappStaking: true,
    dappStakingApi: 'https://api.astar.network/api/v3/shibuya/dapps-staking/',
    priorityDapp: undefined,
  },
]
