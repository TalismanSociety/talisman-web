import { apiState } from '@domains/chains/recoils'
import { useChainState } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import { useRecoilValue } from 'recoil'

const AVAILABLE_AT_BLOCK = new BN(12_721_880)

export const useCountDownToNomsPool = () => {
  const api = useRecoilValue(apiState)
  const session = useChainState('derive', 'chain', 'bestNumberFinalized', [])

  if (session.state !== 'hasValue') return undefined

  const blocksRemaining = session.contents.gte(AVAILABLE_AT_BLOCK)
    ? undefined
    : AVAILABLE_AT_BLOCK.sub(session.contents)

  return {
    blocksRemaining,
    eta: blocksRemaining?.mul(api.consts.babe.expectedBlockTime).toNumber(),
  }
}
