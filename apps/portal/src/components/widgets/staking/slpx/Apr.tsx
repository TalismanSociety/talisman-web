import { type SlpxPair, slpxAprState } from '../../../../domains/staking/slpx'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useRecoilValue } from 'recoil'

const Apr = (props: { slpxPair: SlpxPair | SlpxSubstratePair }) => (
  <>
    {useRecoilValue(
      slpxAprState({ apiEndpoint: props.slpxPair.apiEndpoint, nativeTokenSymbol: props.slpxPair.nativeToken.symbol })
    ).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
  </>
)

export default Apr
