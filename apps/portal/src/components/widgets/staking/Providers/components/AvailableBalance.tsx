import { useAvailableBalance as useSlpxAvailableBalance } from '../hooks/bifrost/useAvailableBalance'
import useLidoAvailableBalance from '../hooks/lido/useAvailableBalance'
import useAvailableBalance from '../hooks/useAvailableBalance'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import AnimatedFiatNumber from '@/components/widgets/AnimatedFiatNumber'
import { ChainProvider } from '@/domains/chains'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@talismn/math'
import { Text } from '@talismn/ui'
import { useEffect, useMemo } from 'react'

type AvailableBalanceProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setAvailableBalanceValue: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  availableBalance: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
}
type AvailableBalanceDisplayProps = Omit<AvailableBalanceProps, 'genesisHash'>

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
type hookMapKey = 'substrate' | 'slpx' | 'liquidStakingLido'

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({
  typeId,
  rowId,
  availableBalance,
  tokenPair,
  symbol,
  setAvailableBalanceValue,
}: AvailableBalanceDisplayProps) => {
  const hookMap: Record<hookMapKey, (arg0?: any, arg1?: boolean) => AvailableBalance> = {
    substrate: useAvailableBalance,
    slpx: useSlpxAvailableBalance,
    liquidStakingLido: useLidoAvailableBalance,
  }
  let balanceValue: AvailableBalance
  switch (typeId) {
    case 'nominationPool':
    case 'delegationSubtensor':
    case 'dappStaking':
      balanceValue = hookMap['substrate']()
      break
    case 'liquidStakingSlpx':
    case 'liquidStakingSlpxSubstrate':
      balanceValue = hookMap['slpx'](tokenPair, tokenPair?.nativeToken.symbol === 'DOT')
      break
    case 'liquidStakingLido':
      balanceValue = hookMap['liquidStakingLido'](symbol)
      break
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
      <Text.Body as="div" alpha="high">
        {balanceValue.availableBalance.toLocaleString()}
      </Text.Body>
      <Text.Body as="div">
        <AnimatedFiatNumber end={useMemo(() => balanceValue.fiatAmount ?? 0, [balanceValue.fiatAmount])} />
      </Text.Body>
    </div>
  )
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  availableBalance,
  apiEndpoint,
  setAvailableBalanceValue,
  tokenPair,
  symbol,
}: AvailableBalanceProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        rowId={rowId}
        availableBalance={availableBalance}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
        symbol={symbol}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
