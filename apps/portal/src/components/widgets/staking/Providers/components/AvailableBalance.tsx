// import useSlpxSubstrateUnlockDuration from '../hooks/bifrost/useSlpxSubstrateUnlockDuration'
// import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import useNominationPoolAvailableBalance from '../hooks/nominationPools/useAvailableBalance'
import useSubtensorAvailableBalance from '../hooks/subtensor/useAvailableBalance'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import AnimatedFiatNumber from '@/components/widgets/AnimatedFiatNumber'
// import { useAvailableBalance } from '../../slpx/AvailableBalances'
import { useAvailableBalance as useSlpxAvailableBalance } from '@/components/widgets/staking/slpx/AvailableBalances'
import { ChainProvider } from '@/domains/chains'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@talismn/math'
// import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { useEffect, useMemo } from 'react'

type AvailableBalanceProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setAvailableBalanceValue: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  availableBalance: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
}
type AvailableBalanceDisplayProps = Omit<AvailableBalanceProps, 'genesisHash'>
type LidoAvailableBalanceProps = Omit<
  AvailableBalanceDisplayProps,
  'symbol' | 'symbol' | 'genesisHash' | 'typeId' | 'tokenPair'
>

/**
 * This is a custom hook that is used to set the availableBalance value in the state.
 * It is used to keep track of the availableBalance value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the availableBalance values
 */
const useSetAvailableBalance = ({
  balanceValue,
  rowId,
  availableBalance,
  setAvailableBalanceValue,
}: {
  balanceValue: number | undefined
  rowId: string
  availableBalance: number | undefined
  setAvailableBalanceValue: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (availableBalance !== balanceValue && balanceValue !== undefined) {
      setAvailableBalanceValue(prev => ({ ...prev, [rowId]: balanceValue }))
    }
  }, [availableBalance, balanceValue, rowId, setAvailableBalanceValue])

  return balanceValue
}

type AvailableBalance = {
  availableBalance: Decimal
  fiatAmount: number
}

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({
  typeId,
  rowId,
  availableBalance,
  tokenPair,
  setAvailableBalanceValue,
}: AvailableBalanceDisplayProps) => {
  // @ts-expect-error
  const hookMap: Record<StakeProviderTypeId, (arg0?: any, arg1?: bool) => AvailableBalance> = {
    nominationPool: useNominationPoolAvailableBalance,
    liquidStakingSlpx: useSlpxAvailableBalance,
    liquidStakingSlpxSubstrate: useSlpxAvailableBalance,
    delegationSubtensor: useSubtensorAvailableBalance,
    // dappStaking: useDappUnlockDuration,
    // liquidStakingLido: () => 0,
  }

  let balanceValue: AvailableBalance
  switch (typeId) {
    case 'nominationPool':
      balanceValue = hookMap['nominationPool']()
      break
    case 'liquidStakingSlpx':
      balanceValue = hookMap['liquidStakingSlpx'](tokenPair)
      break
    case 'liquidStakingSlpxSubstrate':
      balanceValue = hookMap['liquidStakingSlpxSubstrate'](tokenPair, true)
      break
    case 'delegationSubtensor':
      balanceValue = hookMap['delegationSubtensor']()
      break
    // case 'dappStaking':
    //   balanceValue = hookMap['dappStaking']()
    //   break
    default:
      balanceValue = {
        availableBalance: Decimal.fromPlanck(0n, 0),
        fiatAmount: 0,
      }
  }

  useSetAvailableBalance({
    balanceValue: balanceValue.fiatAmount,
    rowId,
    availableBalance,
    setAvailableBalanceValue,
  })

  return (
    <div>
      <div>{balanceValue.availableBalance.toLocaleString()}</div>
      <AnimatedFiatNumber end={useMemo(() => balanceValue.fiatAmount ?? 0, [balanceValue.fiatAmount])} />
    </div>
  )
}

const LidoAvailableBalance = ({ rowId, setAvailableBalanceValue, availableBalance }: LidoAvailableBalanceProps) => {
  const balanceValue = 5

  useSetAvailableBalance({ balanceValue, rowId, availableBalance, setAvailableBalanceValue })

  return <>1-5 day(s)</>
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  availableBalance,
  apiEndpoint,
  setAvailableBalanceValue,
  tokenPair,
}: AvailableBalanceProps) => {
  if (typeId === 'liquidStakingLido') {
    return (
      <LidoAvailableBalance
        rowId={rowId}
        availableBalance={availableBalance}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
      />
    )
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        rowId={rowId}
        availableBalance={availableBalance}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
