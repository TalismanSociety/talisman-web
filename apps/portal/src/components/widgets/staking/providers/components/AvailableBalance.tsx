import { Text } from '@talismn/ui/atoms/Text'
import { useMemo } from 'react'

import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ChainProvider } from '@/domains/chains/provider'
import { Decimal } from '@/util/Decimal'

import useLidoAvailableBalance from '../hooks/lido/useAvailableBalance'
import useAvailableBalance from '../hooks/nominationPools/useAvailableBalance'
import useGetSeekAvailableBalance from '../hooks/seek/useGetSeekAvailableBalance'
import { StakeProviderTypeId } from '../hooks/types'

type AvailableBalanceProps = {
  typeId: StakeProviderTypeId
  genesisHash?: `0x${string}`
  setAvailableBalanceValue: (fiatAmount: number) => void
  apiEndpoint?: string
  symbol?: string
}
type AvailableBalanceDisplayProps = Omit<AvailableBalanceProps, 'genesisHash'>

type AvailableBalance = {
  availableBalance: Decimal
  fiatAmount: number
}
type hookMapKey = 'substrate' | 'liquidStakingLido' | 'talisman'

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({ typeId, symbol, setAvailableBalanceValue }: AvailableBalanceDisplayProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<hookMapKey, (arg0?: any, arg1?: boolean) => AvailableBalance> = {
    substrate: useAvailableBalance,
    liquidStakingLido: useLidoAvailableBalance,
    talisman: useGetSeekAvailableBalance,
  }
  let balanceValue: AvailableBalance
  switch (typeId) {
    case 'nominationPool':
    case 'delegationSubtensor':
    case 'dappStaking':
      balanceValue = hookMap['substrate']()
      break
    case 'liquidStakingLido':
      balanceValue = hookMap['liquidStakingLido'](symbol)
      break
    case 'seekStaking':
      balanceValue = hookMap['talisman']()
      break
    default:
      balanceValue = {
        availableBalance: Decimal.fromPlanck(0n, 0),
        fiatAmount: 0,
      }
  }
  setAvailableBalanceValue(balanceValue.fiatAmount)

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
  genesisHash = '0x123',
  apiEndpoint,
  setAvailableBalanceValue,
  symbol,
}: AvailableBalanceProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
        symbol={symbol}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
