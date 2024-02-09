type BaseChain = {
  genesisHash: `0x${string}`
}

type ChainWithNominationPools = {
  hasNominationPools: true
  priorityPool: number | undefined
  talismanPools: number[] | undefined
}

type ChainWithDappStaking = {
  hasDappStaking: true
  dappStakingApi: string
  priorityDapp: string | undefined
}

export type ChainConfig = BaseChain | (BaseChain & (ChainWithNominationPools | ChainWithDappStaking))

export const chainConfigs: ChainConfig[] = [
  // Polkadot
  {
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    hasNominationPools: true,
    priorityPool: 16,
    talismanPools: [12, 16],
  },
  // Kusama
  {
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    hasNominationPools: true,
    priorityPool: 15,
    talismanPools: [15],
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
  },
  // Vara
  {
    genesisHash: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
    hasNominationPools: true,
    priorityPool: 8,
    talismanPools: [8],
  },
  // Westend
  {
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    hasNominationPools: true,
    priorityPool: undefined,
    talismanPools: undefined,
  },
  // Shibuya
  {
    genesisHash: '0xddb89973361a170839f80f152d2e9e38a376a5a7eccefcade763f46a8e567019',
    hasDappStaking: true,
    dappStakingApi: 'https://api.astar.network/api/v3/shibuya/dapps-staking/',
    priorityDapp: undefined,
  },
]
