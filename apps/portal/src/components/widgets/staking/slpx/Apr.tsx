import { type SlpxPair, slpxAprState } from '../../../../domains/staking/slpx'
import { useRecoilValue } from 'recoil'

const Apr = (props: { slpxPair: SlpxPair }) => (
  <>
    {useRecoilValue(
      slpxAprState({ apiEndpoint: props.slpxPair.apiEndpoint, nativeTokenSymbol: props.slpxPair.nativeToken.symbol })
    ).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
  </>
)

export default Apr
