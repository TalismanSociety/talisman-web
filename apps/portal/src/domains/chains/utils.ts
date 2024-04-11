import type { ChainConfig, ChainInfo } from '.'

export function assertChain<
  TChain extends ChainConfig | ChainInfo,
  TPredicate extends { hasNominationPools?: boolean; hasDappStaking?: boolean }
>(chain: TChain, predicate: TPredicate): asserts chain is Extract<TChain, TPredicate> {
  if (predicate.hasNominationPools && (!('hasNominationPools' in chain) || !chain.hasNominationPools)) {
    throw new Error(`${chain.genesisHash} doesn't have nomination pools`)
  }

  if (predicate.hasDappStaking && (!('hasDappStaking' in chain) || !chain.hasDappStaking)) {
    throw new Error(`${chain.genesisHash} doesn't have DApp staking`)
  }
}
