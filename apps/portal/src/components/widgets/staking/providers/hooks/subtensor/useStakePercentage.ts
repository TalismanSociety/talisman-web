import { useBalances } from '@talismn/balances-react'

import { ROOT_NETUID } from '../../../subtensor/constants'

const useStakePercentage = (hasDTaoStaking: boolean) => {
  const allBalances = useBalances()

  const subtensorBalances = allBalances.find(q => q.chainId === 'bittensor')

  type BittensorBalances = {
    total: bigint
    rootStakedBalance: bigint
    subnetStakedBalanceInTao: bigint
  }

  type Meta = { amountStaked: string; netuid: number }

  const bittensorBalances = subtensorBalances.each.reduce<BittensorBalances>(
    (acc, curr) => {
      acc.total += curr.total.planck
      curr.subtensor.forEach(subtensor => {
        const {
          amount,
          meta: { netuid = 0 },
        } = subtensor as typeof subtensor & { meta: Meta }

        if (netuid === ROOT_NETUID) {
          acc.rootStakedBalance += amount.planck
        } else {
          acc.subnetStakedBalanceInTao += amount.planck
        }
      })
      return acc
    },
    { rootStakedBalance: 0n, subnetStakedBalanceInTao: 0n, total: 0n }
  )

  if (hasDTaoStaking) {
    return Number(bittensorBalances.subnetStakedBalanceInTao) / Number(bittensorBalances.total)
  }

  return Number(bittensorBalances.rootStakedBalance) / Number(bittensorBalances.total)
}

export default useStakePercentage
