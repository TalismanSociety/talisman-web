import { useRecoilValue } from 'recoil'

import { portfolioBalancesState } from '@/domains/balances/recoils'

import { ROOT_NETUID } from '../../../subtensor/constants'

type BittensorBalances = {
  total: bigint
  rootStakedBalance: bigint
  subnetStakedBalanceInTao: bigint
}

type Meta = { amountStaked: string; netuid: number }

const useStakePercentage = (hasDTaoStaking: boolean) => {
  const portfolioBalances = useRecoilValue(portfolioBalancesState)

  const subtensorBalances = portfolioBalances.find(q => q.chainId === 'bittensor')

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

  const { total, rootStakedBalance, subnetStakedBalanceInTao } = bittensorBalances

  if (total === 0n) return 0

  if (hasDTaoStaking) {
    const subnetStakePercentage = Number(subnetStakedBalanceInTao) / Number(total)
    return subnetStakePercentage
  }

  return Number(rootStakedBalance) / Number(total)
}

export default useStakePercentage
