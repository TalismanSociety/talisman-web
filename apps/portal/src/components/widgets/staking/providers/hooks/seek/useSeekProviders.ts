import SeekLogo from '@/assets/seek.svg'
import { CHAIN_ID, CHAIN_NAME, DECIMALS, DEEK_TICKER, DEEK_TOKEN_ADDRESS } from '@/domains/staking/seek/constants'

import { Provider } from '../types'

// A dummy value for the genesis hash to play nice with ChainProvider context
// This is not used for Talisman Seek
const SUBSTRATE_GENESIS_HASH = '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b'

const useSeekProviders = (): Provider[] => {
  const seekProviders: Provider = {
    symbol: DEEK_TICKER,
    logo: SeekLogo,
    chainName: CHAIN_NAME,
    chainId: CHAIN_ID,
    type: 'Seek Staking',
    typeId: 'seekStaking',
    provider: 'Talisman',
    actionLink: `?action=stake&type=seek&chain=${CHAIN_ID}`,
    nativeToken: { symbol: DEEK_TICKER, address: DEEK_TOKEN_ADDRESS, decimals: DECIMALS },
    genesisHash: SUBSTRATE_GENESIS_HASH,
  }

  return [seekProviders]
}

export default useSeekProviders
