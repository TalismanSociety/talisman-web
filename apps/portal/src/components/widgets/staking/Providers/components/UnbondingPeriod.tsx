import useSlpxSubstrateUnlockDuration from '../hooks/bifrost/useSlpxSubstrateUnlockDuration'
import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useVTokenUnlockDuration } from '@/domains/staking/slpx'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { Text } from '@talismn/ui'
import { formatDistance } from 'date-fns'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const unbondingFormatter = (unlockValue: number) => formatDistance(0, unlockValue)

type UnbondingPeriodProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setUnbondingValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  unbonding: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
}
type UnbondingDisplayProps = Omit<UnbondingPeriodProps, 'genesisHash'>
type LidoUnbondingPeriodProps = Omit<
  UnbondingDisplayProps,
  'symbol' | 'symbol' | 'genesisHash' | 'typeId' | 'tokenPair'
>

/**
 * This is a custom hook that is used to set the unbonding value in the state.
 * It is used to keep track of the unbonding value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the unbonding values
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
const UnbondingDisplay = ({ typeId, rowId, unbonding, tokenPair, setUnbondingValues }: UnbondingDisplayProps) => {
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

  return (
    <Text.BodySmall as="div" alpha="high">
      {unlockValue === 0 ? t('None') : unbondingFormatter(unlockValue)}
    </Text.BodySmall>
  )
}

const LidoUnbonding = ({ rowId, setUnbondingValues, unbonding }: LidoUnbondingPeriodProps) => {
  const unlockValue = 5

  useSetUnbonding({ unlockValue, rowId, unbonding, setUnbondingValues })

  return <>1-5 day(s)</>
}

const UnbondingPeriod = ({
  typeId,
  genesisHash,
  rowId,
  unbonding,
  apiEndpoint,
  setUnbondingValues,
  tokenPair,
}: UnbondingPeriodProps) => {
  if (typeId === 'liquidStakingLido') {
    return (
      <LidoUnbonding
        rowId={rowId}
        unbonding={unbonding}
        setUnbondingValues={setUnbondingValues}
        apiEndpoint={apiEndpoint}
      />
    )
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <UnbondingDisplay
        typeId={typeId}
        rowId={rowId}
        unbonding={unbonding}
        setUnbondingValues={setUnbondingValues}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default UnbondingPeriod
