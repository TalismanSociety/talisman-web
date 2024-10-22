import { StakeProvider } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { useApr as useDappApr } from '@/domains/staking/dappStaking'
import { slpxAprState } from '@/domains/staking/slpx'
import { useApr as useNominationPoolApr } from '@/domains/staking/substrate/nominationPools'
import { highestAprTaoValidatorAtom } from '@/domains/staking/subtensor/atoms/taostats'
import { useAtomValue } from 'jotai'
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

const SubtensorApr = ({ rowId, apr, setAprValues }: NominationPoolAprProps) => {
  const { apr: taoApr } = useAtomValue(highestAprTaoValidatorAtom)

  const subtensorApr = Number(taoApr)

  useEffect(() => {
    if (apr !== subtensorApr && !!subtensorApr) {
      setAprValues(prev => ({ ...prev, [rowId]: subtensorApr }))
    }
  }, [apr, subtensorApr, rowId, setAprValues])

  return <>{aprFormatter(subtensorApr)}</>
}

const DappApr = ({ rowId, apr, setAprValues }: NominationPoolAprProps) => {
  const dappAprData = useDappApr()
  const dappApr = dappAprData.totalApr

  useEffect(() => {
    if (apr !== dappApr && !!dappApr) {
      setAprValues(prev => ({ ...prev, [rowId]: dappApr }))
    }
  }, [apr, dappApr, rowId, setAprValues])

  return <>{aprFormatter(dappApr)}</>
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
    case 'Delegation':
      return (
        <ChainProvider
          chain={{
            genesisHash: genesisHash,
          }}
        >
          <SubtensorApr setAprValues={setAprValues} rowId={rowId} apr={apr} />
        </ChainProvider>
      )
    case 'DApp staking':
      return (
        <ChainProvider
          chain={{
            genesisHash: genesisHash,
          }}
        >
          <DappApr setAprValues={setAprValues} rowId={rowId} apr={apr} />
        </ChainProvider>
      )
    default:
      return <div>Banana</div>
  }
}

export default Apr
