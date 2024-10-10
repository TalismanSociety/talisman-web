import { ChainProvider } from '../../../../domains/chains'
import { slpxSubstratePairsState } from '../../../../domains/staking/slpxSubstrate/recoils'
import AddStakeSideSheet from './AddStakeSideSheet'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const SlpxSubstrateStakeSideSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)

  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'slpx-substrate'

  const slpxPair = useMemo(
    () => slpxSubstratePairs.find(x => x.nativeToken.symbol === searchParams.get('native-token')),
    [searchParams, slpxSubstratePairs]
  )

  if (!open) {
    return null
  }

  if (slpxPair === undefined) {
    throw new Error(`No SLPx Substrate staking available for token: ${searchParams.get('native-token') ?? ''}`)
  }

  return (
    <ChainProvider
      chain={{
        genesisHash: slpxPair.substrateChainGenesisHash,
      }}
    >
      <AddStakeSideSheet
        slpxPair={slpxPair}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            sp.delete('native-token')
            return sp
          })
        }
      />
    </ChainProvider>
  )
}

export default SlpxSubstrateStakeSideSheet
