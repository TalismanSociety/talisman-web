import useApr from '../hooks/nominationPools/useApr'
import { StakeProvider } from '../hooks/useProvidersData'

const aprFormatter = (apr: number) => {
  return apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

const NominationPoolApr = ({ rpcId }: { rpcId: string }) => {
  const apr = useApr({ rpcId })

  return <>{aprFormatter(apr)}</>
}

const Apr = ({ type, rpcId }: { type: StakeProvider; rpcId: string }) => {
  switch (type) {
    case 'Nomination pool':
      return <NominationPoolApr rpcId={rpcId} />

    default:
      return <div>Banana</div>
  }
}

export default Apr
