import { StakeProvider } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
// import { useApr as useDappApr } from '@/domains/staking/dappStaking'
// import { lidoAprState } from '@/domains/staking/lido/recoils'
// import { useSlpxAprState } from '@/domains/staking/slpx'
import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { formatDistance } from 'date-fns'
// import { useHighestApr } from '@/domains/staking/subtensor/hooks/useApr'
import { useEffect } from 'react'

// import { useRecoilValue } from 'recoil'

const unbondingFormatter = (unlockValue: number) => formatDistance(0, unlockValue)

type AprProps = {
  type: StakeProvider
  genesisHash: `0x${string}`
  rowId: string
  setUnbondingValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  unbonding: number | undefined
  symbol?: string
  apiEndpoint?: string
}
type AprDisplayProps = Omit<AprProps, 'genesisHash'>
// type LidoAprProps = Omit<AprDisplayProps, 'symbol' | 'symbol' | 'genesisHash' | 'type'>

/**
 * This is a custom hook that is used to set the APR value in the state.
 * It is used to keep track of the APR value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the APR values
 */
const useSetUnbonding = ({
  unlockValue,
  rowId,
  unbonding,
  setUnbondingValues,
}: {
  unlockValue: number | undefined
  rowId: string
  unbonding: number | undefined
  setUnbondingValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (unbonding !== unlockValue && unlockValue !== undefined) {
      setUnbondingValues(prev => ({ ...prev, [rowId]: unlockValue }))
    }
  }, [unbonding, unlockValue, rowId, setUnbondingValues])

  return unlockValue
}

// This component is used to get around the react rules of conditional hooks
const UnbondingDisplay = ({
  type,
  rowId,
  //  symbol, apiEndpoint,
  unbonding,
  setUnbondingValues,
}: AprDisplayProps) => {
  const hookMap = {
    'Nomination pool': useNominationPoolUnlockDuration,
    // 'Liquid staking': useSlpxAprState,
    // Delegation: useHighestApr,
    // 'DApp staking': useDappApr,
  }

  let unlockValue: number = 0
  switch (type) {
    case 'Nomination pool':
      unlockValue = hookMap['Nomination pool']()
      break
    // case 'Liquid staking':
    //   unlockValue = hookMap['Liquid staking']({ apiEndpoint: apiEndpoint ?? '', nativeTokenSymbol: symbol ?? '' })
    //   break
    // case 'Delegation':
    //   unlockValue = hookMap['Delegation']()
    //   break
    // case 'DApp staking':
    //   unlockValue = hookMap['DApp staking']().totalApr
    //   break
    default:
      unlockValue = 0
  }

  useSetUnbonding({ unlockValue, rowId, unbonding, setUnbondingValues })

  return <>{unbondingFormatter(unlockValue ?? 0)}</>
}

// const LidoApr = ({ rowId, apr, setUnbondingValues, apiEndpoint }: LidoAprProps) => {
//   const aprValue = useRecoilValue(lidoAprState(apiEndpoint ?? ''))

//   useSetUnbonding({ aprValue, rowId, apr, setUnbondingValues })

//   return <>{unbondingFormatter(aprValue)}</>
// }

const UnbondingPeriod = ({
  type,
  genesisHash,
  rowId,
  unbonding,
  symbol,
  apiEndpoint,
  setUnbondingValues,
}: AprProps) => {
  if (type === 'Liquid staking' && symbol === 'ETH') {
    return 54321
    // return <LidoApr rowId={rowId} apr={apr} setUnbondingValues={setUnbondingValues} apiEndpoint={apiEndpoint} />
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <UnbondingDisplay
        type={type}
        rowId={rowId}
        unbonding={unbonding}
        setUnbondingValues={setUnbondingValues}
        symbol={symbol}
        apiEndpoint={apiEndpoint}
      />
    </ChainProvider>
  )
}

export default UnbondingPeriod
