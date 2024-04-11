import { usePolkadotApiId } from '@talismn/react-polkadot-api'

export const useSubstrateApiEndpoint = () => usePolkadotApiId() as string
