import useSlpxSubstrateUnlockDuration from '../hooks/bifrost/useSlpxSubstrateUnlockDuration'
import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useVTokenUnlockDuration } from '@/domains/staking/slpx'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
// import { useApr as useDappApr } from '@/domains/staking/dappStaking'
// import { lidoAprState } from '@/domains/staking/lido/recoils'
// import { useSlpxAprState } from '@/domains/staking/slpx'
import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { formatDistance } from 'date-fns'
// import { useHighestApr } from '@/domains/staking/subtensor/hooks/useApr'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// import { useRecoilValue } from 'recoil'

const unbondingFormatter = (unlockValue: number) => formatDistance(0, unlockValue)

type UnbondingPeriodProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setUnbondingValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  unbonding: number | undefined
  symbol?: string
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
}
type AprDisplayProps = Omit<UnbondingPeriodProps, 'genesisHash'>
// type LidoUnbondingPeriodProps = Omit<AprDisplayProps, 'symbol' | 'symbol' | 'genesisHash' | 'type'>

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
  typeId,
  rowId,
  //  symbol, apiEndpoint,
  unbonding,
  tokenPair,
  setUnbondingValues,
}: AprDisplayProps) => {
  const { t } = useTranslation()

  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolUnlockDuration,
    liquidStakingSlpx: useVTokenUnlockDuration,
    liquidStakingSlpxSubstrate: useSlpxSubstrateUnlockDuration,
    delegationSubtensor: () => 0,
    dappStaking: useDappUnlockDuration,
    liquidStakingLido: () => 0,
  }

  let unlockValue: number = 0
  switch (typeId) {
    case 'nominationPool':
      unlockValue = hookMap['nominationPool']()
      break
    case 'liquidStakingSlpx':
      unlockValue = hookMap['liquidStakingSlpx'](tokenPair)
      break
    case 'liquidStakingSlpxSubstrate':
      console.log({ tokenPair })
      unlockValue = hookMap['liquidStakingSlpxSubstrate']({ slpxPair: tokenPair })
      break
    case 'delegationSubtensor':
      unlockValue = hookMap['delegationSubtensor']()
      break
    case 'dappStaking':
      unlockValue = hookMap['dappStaking']()
      break
    default:
      unlockValue = 0
  }

  useSetUnbonding({ unlockValue, rowId, unbonding, setUnbondingValues })

  return <>{unlockValue === 0 ? t('None') : unbondingFormatter(unlockValue)}</>
}

// const LidoApr = ({ rowId, apr, setUnbondingValues, apiEndpoint }: LidoUnbondingPeriodProps) => {
//   const aprValue = useRecoilValue(lidoAprState(apiEndpoint ?? ''))

//   useSetUnbonding({ aprValue, rowId, apr, setUnbondingValues })

//   return <>{unbondingFormatter(aprValue)}</>
// }

const UnbondingPeriod = ({
  typeId,
  genesisHash,
  rowId,
  unbonding,
  symbol,
  apiEndpoint,
  setUnbondingValues,
  tokenPair,
}: UnbondingPeriodProps) => {
  if (typeId === 'liquidStakingLido') {
    return 54321
    // return <LidoApr rowId={rowId} apr={apr} setUnbondingValues={setUnbondingValues} apiEndpoint={apiEndpoint} />
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <UnbondingDisplay
        typeId={typeId}
        rowId={rowId}
        unbonding={unbonding}
        setUnbondingValues={setUnbondingValues}
        symbol={symbol}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default UnbondingPeriod
