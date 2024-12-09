import { Text } from '@talismn/ui'
import { formatDistance } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { ChainProvider } from '@/domains/chains'
import { useVTokenUnlockDuration } from '@/domains/staking/slpx'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'

import useSlpxSubstrateUnlockDuration from '../hooks/bifrost/useSlpxSubstrateUnlockDuration'
import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import { StakeProviderTypeId } from '../hooks/useProvidersData'

const unbondingFormatter = (unlockValue: number) => formatDistance(0, unlockValue)

type UnbondingPeriodProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  setUnbondingValues: (unbonding: number) => void
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
}
type UnbondingDisplayProps = Omit<UnbondingPeriodProps, 'genesisHash'>

// This component is used to get around the react rules of conditional hooks
const UnbondingDisplay = ({ typeId, tokenPair, setUnbondingValues }: UnbondingDisplayProps) => {
  const { t } = useTranslation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolUnlockDuration,
    liquidStakingSlpx: useVTokenUnlockDuration,
    liquidStakingSlpxSubstrate: useSlpxSubstrateUnlockDuration,
    delegationSubtensor: () => 0,
    dappStaking: useDappUnlockDuration,
    liquidStakingLido: () => 5,
  }

  let unlockValue: number = 0
  let label: string = ''
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
      label = t('None')
      break
    case 'dappStaking':
      unlockValue = hookMap['dappStaking']()
      break
    case 'liquidStakingLido':
      unlockValue = hookMap['liquidStakingLido']()
      label = '1-5 day(s)'
      break
    default:
      unlockValue = 0
  }

  setUnbondingValues(unlockValue)

  return (
    <Text.BodySmall as="div" alpha="high">
      {label || unbondingFormatter(unlockValue)}
    </Text.BodySmall>
  )
}

const UnbondingPeriod = ({ typeId, genesisHash, apiEndpoint, setUnbondingValues, tokenPair }: UnbondingPeriodProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <UnbondingDisplay
        typeId={typeId}
        setUnbondingValues={setUnbondingValues}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default UnbondingPeriod
