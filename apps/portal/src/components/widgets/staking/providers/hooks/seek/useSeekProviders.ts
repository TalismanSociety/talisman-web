import { evmErc20TokenId } from '@talismn/balances-react'

import SeekLogo from '@/assets/seek.svg'
import { CHAIN_ID, CHAIN_NAME, DECIMALS, SEEK_TICKER, SEEK_TOKEN_ADDRESS } from '@/domains/staking/seek/constants'

import { Provider } from '../types'

const useSeekProviders = (): Provider[] => {
  const seekProviders: Provider = {
    balancesTokenIds: [evmErc20TokenId(String(CHAIN_ID), SEEK_TOKEN_ADDRESS)],
    symbol: SEEK_TICKER,
    logo: SeekLogo,
    chainName: CHAIN_NAME,
    chainId: CHAIN_ID,
    type: 'Seek Staking',
    typeId: 'seekStaking',
    provider: 'Talisman',
    actionLink: `?action=stake&type=seek`,
    nativeToken: { symbol: SEEK_TICKER, address: SEEK_TOKEN_ADDRESS, decimals: DECIMALS },
  }

  return [seekProviders]
}

export default useSeekProviders
