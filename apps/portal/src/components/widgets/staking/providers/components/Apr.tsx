import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { useApr as useDappApr } from '@/domains/staking/dappStaking/hooks/useApr'
import { useSlpxAprState } from '@/domains/staking/slpx/recoils'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools/hooks/useReturn'
import { useHighestApr } from '@/domains/staking/subtensor/hooks/useApr'

import useLidoApr from '../hooks/lido/useApr'
import { StakeProviderTypeId } from '../hooks/types'

const aprFormatter = (apr: number) =>
  apr > 0 ? apr?.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 }) : '--'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="text-lg">
      <WithAprDocsLink>{aprFormatter(aprValue ?? 0)}</WithAprDocsLink>
    </div>
  )
}

const Apr = ({ typeId, genesisHash, symbol, apiEndpoint, setAprValues }: AprProps) => {
  return (
    <ChainProvider chain={{ genesisHash: genesisHash }}>
      <AprDisplay typeId={typeId} setAprValues={setAprValues} symbol={symbol} apiEndpoint={apiEndpoint} />
    </ChainProvider>
  )
}

/**
 * For chains with a novel staking rewards mechanism, this component adds an info tooltip to the
 * calculated APR which links to the rewards docs for the chain.
 */
const WithAprDocsLink = ({ children }: { children: ReactNode }) => {
  const chain = useRecoilValue(useChainState())

  // return the APR
  if (chain?.id !== 'analog-timechain') return children

  // return the APR wrapped with a tooltip
  return (
    <div className="flex items-center gap-1">
      {children}
      <Tooltip content="Learn more about Analog Timechain staking rewards">
        <a
          href="https://docs.analog.one/documentation/analog-network/staking/rewards"
          target="_blank"
          rel="noreferrer noopener"
        >
          <InfoIcon className="h-[1em] w-[1em] text-xl" />
        </a>
      </Tooltip>
    </div>
  )
}

export default Apr
