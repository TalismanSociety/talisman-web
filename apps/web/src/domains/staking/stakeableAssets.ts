import { chains, type Chain } from '@domains/chains'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'

export type StakeProvider = {
  type: string
  description: string
  url: string
}

type Asset = {
  symbol: string
  logo: string
  chain: string
  apr: string
  providers: readonly StakeProvider[]
}

const nominationPool = (chain: Chain) => {
  const url = new URL('staking', document.location.href)
  url.searchParams.set('action', 'stake')
  url.searchParams.set('type', 'nomination-pools')
  url.searchParams.set('chain', chain.id)

  return {
    type: 'Nomination pools',
    description:
      'A native staking provider for Substrate that facilitates secure, decentralized token staking, optimizing rewards and ensuring network participation and validation.',
    url: url.toString().slice(url.origin.length),
  }
}

export const stakeableAssets = [
  {
    symbol: chains[0].nativeToken.symbol,
    logo: chains[0].nativeToken.logo,
    chain: chains[0].name,
    apr: '~15%',
    providers: [nominationPool(chains[0])],
  },
  {
    symbol: chains[1].nativeToken.symbol,
    logo: chains[1].nativeToken.logo,
    chain: chains[1].name,
    apr: '~8%',
    providers: [nominationPool(chains[1])],
  },
  {
    symbol: chains[2].nativeToken.symbol,
    logo: chains[2].nativeToken.logo,
    chain: chains[2].name,
    apr: '~4%',
    providers: [nominationPool(chains[2])],
  },
  {
    symbol: 'GLMR',
    logo: githubChainLogoUrl('moonbeam'),
    chain: 'Moonbeam',
    apr: '~4%',
    providers: [
      {
        type: 'Bifrost liquid staking',
        description: 'Bifrost liquid staking',
        url: (() => {
          const url = new URL('staking', document.location.href)
          url.searchParams.set('action', 'stake')
          url.searchParams.set('type', 'slpx')
          return url.toString().slice(url.origin.length)
        })(),
      },
    ],
  },
] as const satisfies readonly Asset[]
