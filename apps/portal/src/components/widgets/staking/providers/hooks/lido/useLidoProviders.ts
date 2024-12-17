import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { useRecoilValue } from 'recoil'

import { lidoSuitesState } from '@/domains/staking/lido/recoils'

import { Provider } from '../types'

// A dummy value for the genesis hash to play nice with ChainProvider context
// This is not used for Lido
const SUBSTRATE_GENESIS_HASH = '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b'

const useLidoProviders = () => {
  const lidoSuites = useRecoilValue(lidoSuitesState)

  const lidoProviders: Provider[] = lidoSuites.map(lidoSuite => {
    const { symbol, decimals } = lidoSuite.chain.nativeCurrency
    const logo = githubChainLogoUrl('1')
    return {
      symbol: symbol,
      logo,
      chainName: lidoSuite.chain.name,
      chainId: lidoSuite.chain.id,
      type: 'Liquid staking',
      typeId: 'liquidStakingLido',
      provider: 'Lido',
      actionLink: `?action=stake&type=lido&token-address=${lidoSuite.token.address}`,
      nativeToken: { symbol, decimals, address: lidoSuite.token.address },
      apiEndpoint: lidoSuite.apiEndpoint,
      genesisHash: SUBSTRATE_GENESIS_HASH,
    }
  })

  return lidoProviders
}

export default useLidoProviders
