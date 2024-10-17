export type Provider = {
  assetName: string
  apr: number
  type: string
  provider: string
  unbondingPeriod: string
  availableBalance: string
  action: string
}

const useProvidersData = () => {
  const providersData: Provider[] = [
    {
      assetName: 'banana',
      apr: 0.1,
      action: 'stake',
      type: 'Nomination pool',
      provider: 'Polkadot',
      unbondingPeriod: '5 days',
      availableBalance: '999',
    },
    {
      assetName: 'apple',
      apr: 0.3,
      action: 'stake',
      type: 'Nomination pool',
      provider: 'Polkadot',
      unbondingPeriod: '7 days',
      availableBalance: '1000',
    },
  ]

  return providersData
}

export default useProvidersData
