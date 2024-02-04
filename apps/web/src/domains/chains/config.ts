export type ChainConfig = {
  genesisHash: `0x${string}`
  priorityPool: number | undefined
}

export const chainConfigs = [
  // Polkadot
  {
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    priorityPool: 16,
  },
  // Kusama
  {
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    priorityPool: 15,
  },
  // Aleph0
  {
    genesisHash: '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e',
    priorityPool: 47,
  },
  // Vara
  {
    genesisHash: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
    priorityPool: 8,
  },
  // Westend
  {
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    priorityPool: undefined,
  },
] as const satisfies readonly ChainConfig[]
