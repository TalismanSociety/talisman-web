import { usePolkadotApiId } from '@talismn/react-polkadot-api'

export const useSubstrateChainGenesisHash = () => usePolkadotApiId() as `0x${string}`
