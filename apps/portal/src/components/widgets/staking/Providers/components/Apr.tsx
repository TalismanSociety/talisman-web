import { StakeProvider } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { slpxAprState } from '@/domains/staking/slpx'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const aprFormatter = (apr: number) => {
  return apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

type NominationPoolAprProps = Omit<AprProps, 'type' | 'genesisHash' | 'symbol' | 'apiEndpoint'>
type SlpxAprProps = Omit<AprProps, 'type' | 'genesisHash'>

const NominationPoolApr = ({ rowId, apr, setAprValues }: NominationPoolAprProps) => {
  const nomPoolApr = useNominationPoolApr()

  useEffect(() => {
    if (apr !== nomPoolApr && !!nomPoolApr) {
      setAprValues(prev => ({ ...prev, [rowId]: nomPoolApr }))
    }
  }, [apr, nomPoolApr, rowId, setAprValues])

  return <>{aprFormatter(nomPoolApr)}</>
}

const SlpxApr = ({ rowId, apr, setAprValues, symbol, apiEndpoint }: SlpxAprProps) => {
  const slpxApr = useRecoilValue(slpxAprState({ apiEndpoint: apiEndpoint ?? '', nativeTokenSymbol: symbol }))

  useEffect(() => {
    if (apr !== slpxApr && !!slpxApr) {
      setAprValues(prev => ({ ...prev, [rowId]: slpxApr }))
    }
  }, [apr, slpxApr, rowId, setAprValues])

  return <>{aprFormatter(slpxApr)}</>
}

type AprProps = {
  type: StakeProvider
  genesisHash: `0x${string}`
  rowId: string
  setAprValues: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  apr: number | undefined
  symbol: string
  apiEndpoint: string | undefined
}

const Apr = ({ type, genesisHash, rowId, apr, symbol, apiEndpoint, setAprValues }: AprProps) => {
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
    case 'Liquid staking':
      return (
        <ChainProvider
          chain={{
            genesisHash: genesisHash,
          }}
        >
          <SlpxApr setAprValues={setAprValues} rowId={rowId} apr={apr} symbol={symbol} apiEndpoint={apiEndpoint} />
        </ChainProvider>
      )
    default:
      return <div>Banana</div>
  }
}

export default Apr
