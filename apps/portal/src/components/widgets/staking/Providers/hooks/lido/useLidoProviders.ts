import { Provider } from '../useProvidersData'
import { lidoSuitesState } from '@/domains/staking/lido/recoils'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { useRecoilValue } from 'recoil'

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
      provider: 'Lido',
      unbondingPeriod: '999',
      stakePercentage: 0,
      actionLink: `?action=stake&type=lido&token-address=${lidoSuite.token.address}`,
      nativeToken: { symbol, decimals },
      apiEndpoint: lidoSuite.apiEndpoint,
    }
  })

  return lidoProviders
}

export default useLidoProviders
