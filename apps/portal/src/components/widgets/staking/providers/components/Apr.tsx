import { Text } from '@talismn/ui'

import { ChainProvider } from '@/domains/chains'
import { useApr as useDappApr } from '@/domains/staking/dappStaking'
import { useSlpxAprState } from '@/domains/staking/slpx'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'
import { useHighestApr } from '@/domains/staking/subtensor/hooks/useApr'

import useLidoApr from '../hooks/lido/useApr'
import { StakeProviderTypeId } from '../hooks/useProvidersData'

const aprFormatter = (apr: number) => apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })

type AprProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  setAprValues: (apr: number) => void
  symbol?: string
  apiEndpoint?: string
}
type AprDisplayProps = Omit<AprProps, 'genesisHash'>

// This component is used to get around the react rules of conditional hooks
const AprDisplay = ({ typeId, symbol, apiEndpoint, setAprValues }: AprDisplayProps) => {
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolApr,
    liquidStakingSlpx: useSlpxAprState,
    delegationSubtensor: useHighestApr,
    liquidStakingLido: useLidoApr,
    // @ts-expect-error
    dappStaking: useDappApr,
  }

  let aprValue: number = 0
  switch (typeId) {
    case 'nominationPool':
      aprValue = hookMap['nominationPool']()
      break
    case 'liquidStakingSlpx':
    case 'liquidStakingSlpxSubstrate':
      aprValue = hookMap['liquidStakingSlpx']({ apiEndpoint: apiEndpoint ?? '', nativeTokenSymbol: symbol ?? '' })
      break
    case 'delegationSubtensor':
      aprValue = hookMap['delegationSubtensor']()
      break
    case 'dappStaking':
      // @ts-expect-error
      aprValue = hookMap['dappStaking']().totalApr
      break
    case 'liquidStakingLido':
      aprValue = hookMap['liquidStakingLido']({ apiEndpoint })
      break
    default:
      aprValue = 0
  }

  setAprValues(aprValue)

  return (
    <Text.BodySmall as="div" alpha="high">
      {aprFormatter(aprValue ?? 0)}
    </Text.BodySmall>
  )
}

const Apr = ({ typeId, genesisHash, symbol, apiEndpoint, setAprValues }: AprProps) => {
  return (
    <ChainProvider chain={{ genesisHash: genesisHash }}>
      <AprDisplay typeId={typeId} setAprValues={setAprValues} symbol={symbol} apiEndpoint={apiEndpoint} />
    </ChainProvider>
  )
}

export default Apr
