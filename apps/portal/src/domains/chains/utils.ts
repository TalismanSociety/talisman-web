import type { ChainConfig, ChainInfo } from '.'

export function assertChain<
  TChain extends ChainConfig | ChainInfo,
  TPredicate extends { hasNominationPools?: boolean; hasDappStaking?: boolean; hasSubtensorStaking?: boolean }
>(chain: TChain, predicate: TPredicate): asserts chain is Extract<TChain, TPredicate> {
  if (predicate.hasNominationPools && (!('hasNominationPools' in chain) || !chain.hasNominationPools)) {
    throw new Error(`${chain.genesisHash} doesn't have nomination pools`)
  }

  if (predicate.hasDappStaking && (!('hasDappStaking' in chain) || !chain.hasDappStaking)) {
    throw new Error(`${chain.genesisHash} doesn't have DApp staking`)
  }

  if (predicate.hasSubtensorStaking && (!('hasSubtensorStaking' in chain) || !chain.hasSubtensorStaking)) {
    throw new Error(`${chain.genesisHash} doesn't have subtensor staking`)
  }
}
