import { StakeProvider } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'

const NominationPoolApr = () => {
  return <>{useNominationPoolApr().toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</>
}

const Apr = ({ type, genesisHash }: { type: StakeProvider; rpcId: string; genesisHash: `0x${string}` }) => {
  switch (type) {
    case 'Nomination pool':
      return (
        <ChainProvider
          chain={{
            genesisHash: genesisHash,
          }}
        >
          <NominationPoolApr />
        </ChainProvider>
      )
    default:
      return <div>Banana</div>
  }
}

export default Apr
