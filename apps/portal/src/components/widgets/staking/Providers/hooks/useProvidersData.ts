import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'

export type Provider = {
  symbol: string | undefined
  logo: string | undefined
  chainName: string | undefined
  chainId: string
  apr: string | undefined
  type: string
  provider: string | undefined
  unbondingPeriod: string
  availableBalance: string
  stakePercentage: number
  actionLink: string
}

const useProvidersData = () => {
  const nominationPoolProviders = useNominationPoolsProviders()

  console.log({ nominationPoolProviders })

  const providersData: Provider[] = [
    ...nominationPoolProviders,
    {
      symbol: 'MockedDOT',
      logo: 'https://example.com/dot-logo.png',
      chainName: 'Polkadot',
      chainId: '1',
      apr: '5.00%',
      type: 'Nomination pool',
      provider: 'Polkadot',
      unbondingPeriod: '28 days',
      availableBalance: '123',
      stakePercentage: 0.65,
      actionLink: '?action=stake&type=nomination-pools&chain=1',
    },
  ]

  return providersData
}

export default useProvidersData
