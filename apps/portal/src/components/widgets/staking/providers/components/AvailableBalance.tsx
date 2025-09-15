import { Text } from '@talismn/ui/atoms/Text'
import { useMemo } from 'react'

import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ChainProvider } from '@/domains/chains/provider'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@/util/Decimal'

import { useAvailableBalance as useSlpxAvailableBalance } from '../hooks/bifrost/useAvailableBalance'
import useLidoAvailableBalance from '../hooks/lido/useAvailableBalance'
import useGetSeekAvailableBalance from '../hooks/seek/hooks/useGetSeekAvailableBalance'
import { StakeProviderTypeId } from '../hooks/types'
import useAvailableBalance from '../hooks/useAvailableBalance'

type AvailableBalanceProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  setAvailableBalanceValue: (fiatAmount: number) => void
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
}
type AvailableBalanceDisplayProps = Omit<AvailableBalanceProps, 'genesisHash'>

type AvailableBalance = {
  availableBalance: Decimal
  fiatAmount: number
}
type hookMapKey = 'substrate' | 'slpx' | 'liquidStakingLido' | 'talisman'

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({
  typeId,
  tokenPair,
  symbol,
  setAvailableBalanceValue,
}: AvailableBalanceDisplayProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<hookMapKey, (arg0?: any, arg1?: boolean) => AvailableBalance> = {
    substrate: useAvailableBalance,
    slpx: useSlpxAvailableBalance,
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
    case 'liquidStakingSlpx':
    case 'liquidStakingSlpxSubstrate':
      balanceValue = hookMap['slpx'](tokenPair, tokenPair?.nativeToken.symbol === 'DOT')
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
  genesisHash,
  apiEndpoint,
  setAvailableBalanceValue,
  tokenPair,
  symbol,
}: AvailableBalanceProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
        symbol={symbol}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
