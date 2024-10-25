import { StakeProviderTypeId } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useApr as useDappApr } from '@/domains/staking/dappStaking'
import { lidoAprState } from '@/domains/staking/lido/recoils'
import { useSlpxAprState } from '@/domains/staking/slpx'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'
import { useHighestApr } from '@/domains/staking/subtensor/hooks/useApr'
import { Text } from '@talismn/ui'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const aprFormatter = (apr: number) => apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })

type AprProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setAprValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  apr: number | undefined
  symbol?: string
  apiEndpoint?: string
}
type AprDisplayProps = Omit<AprProps, 'genesisHash'>
type LidoAprProps = Omit<AprDisplayProps, 'symbol' | 'symbol' | 'genesisHash' | 'typeId'>

/**
 * This is a custom hook that is used to set the APR value in the state.
 * It is used to keep track of the APR value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the APR values
 */
const useSetApr = ({
  aprValue,
  rowId,
  apr,
  setAprValues,
}: {
  aprValue: number | undefined
  rowId: string
  apr: number | undefined
  setAprValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (apr !== aprValue && aprValue !== undefined) {
      setAprValues(prev => ({ ...prev, [rowId]: aprValue }))
    }
  }, [apr, aprValue, rowId, setAprValues])

  return aprValue
}

// This component is used to get around the react rules of conditional hooks
const AprDisplay = ({ typeId, rowId, symbol, apiEndpoint, apr, setAprValues }: AprDisplayProps) => {
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolApr,
    liquidStakingSlpx: useSlpxAprState,
    delegationSubtensor: useHighestApr,
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
    default:
      aprValue = 0
  }

  useSetApr({ aprValue, rowId, apr, setAprValues })

  return (
    <Text.BodySmall as="div" alpha="high">
      {aprFormatter(aprValue ?? 0)}
    </Text.BodySmall>
  )
}

const LidoApr = ({ rowId, apr, setAprValues, apiEndpoint }: LidoAprProps) => {
  const aprValue = useRecoilValue(lidoAprState(apiEndpoint ?? ''))

  useSetApr({ aprValue, rowId, apr, setAprValues })

  return <>{aprFormatter(aprValue)}</>
}

const Apr = ({ typeId, genesisHash, rowId, apr, symbol, apiEndpoint, setAprValues }: AprProps) => {
  if (typeId === 'liquidStakingLido') {
    return <LidoApr rowId={rowId} apr={apr} setAprValues={setAprValues} apiEndpoint={apiEndpoint} />
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <AprDisplay
        typeId={typeId}
        rowId={rowId}
        apr={apr}
        setAprValues={setAprValues}
        symbol={symbol}
        apiEndpoint={apiEndpoint}
      />
    </ChainProvider>
  )
}

export default Apr
