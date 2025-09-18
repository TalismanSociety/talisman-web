import SeekLogo from '@/assets/seek.svg'
import { CHAIN_ID, CHAIN_NAME, DECIMALS, DEEK_TICKER, DEEK_TOKEN_ADDRESS } from '@/domains/staking/seek/constants'

import { Provider } from '../types'

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
  }

  return [seekProviders]
}

export default useSeekProviders
