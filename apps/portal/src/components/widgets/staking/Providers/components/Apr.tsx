import { StakeProvider } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'
import { useEffect } from 'react'

const aprFormatter = (apr: number) => {
  return apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

type NominationPoolAprProps = Omit<AprProps, 'type' | 'genesisHash'>

const NominationPoolApr = ({ rowId, apr, setAprValues }: NominationPoolAprProps) => {
  const nomPoolApr = useNominationPoolApr()

  useEffect(() => {
    if (apr !== nomPoolApr && !!nomPoolApr) {
      setAprValues(prev => ({ ...prev, [rowId]: nomPoolApr }))
    }
  }, [apr, nomPoolApr, rowId, setAprValues])

  return <>{aprFormatter(nomPoolApr)}</>
}

type AprProps = {
  type: StakeProvider
  genesisHash: `0x${string}`
  rowId: string
  setAprValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  apr?: number
}

const Apr = ({ type, genesisHash, rowId, apr, setAprValues }: AprProps) => {
  switch (type) {
    case 'Nomination pool':
      return (
        <ChainProvider
          chain={{
            genesisHash: genesisHash,
          }}
        >
          <NominationPoolApr setAprValues={setAprValues} rowId={rowId} apr={apr} />
        </ChainProvider>
      )
    default:
      return <div>Banana</div>
  }
}

export default Apr
