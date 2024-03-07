import type { Account } from '@domains/accounts'
import { Decimal } from '@talismn/math'
import { useContractRead, useContractReads, useToken } from 'wagmi'
import { lidoTokenAbi, withdrawalQueueAbi } from './abi'
import type { LidoSuite } from './types'
import { useRecoilValue } from 'recoil'
import { tokenPriceState } from '@domains/chains'

export const useStakes = (accounts: Account[], lidoSuite: LidoSuite) => {
  const filteredAccounts = accounts.filter(x => x.type === 'ethereum')

  const { data: token } = useToken({ chainId: lidoSuite.chain.id, address: lidoSuite.token.address, suspense: true })

  const { data: balances } = useContractReads({
    contracts: filteredAccounts.map(
      x =>
        ({
          chainId: lidoSuite.chain.id,
          address: lidoSuite.token.address,
          abi: lidoTokenAbi,
          functionName: 'balanceOf',
          args: [x.address],
        } as const)
    ),
    watch: true,
    suspense: true,
    allowFailure: false,
  })

  const { data: withdrawalIds } = useContractReads({
    contracts: filteredAccounts.map(x => ({
      chainId: lidoSuite.chain.id,
      address: lidoSuite.withdrawalQueue,
      abi: withdrawalQueueAbi,
      functionName: 'getWithdrawalRequests',
      args: [x.address],
    })),
    watch: true,
    suspense: true,
    allowFailure: false,
  })

  const sortedWithdrawalIds = withdrawalIds?.flatMap(x => x as bigint[]).sort((a, b) => (a > b ? 1 : -1)) ?? []

  const { data: lastCheckpointIndex } = useContractRead({
    chainId: lidoSuite.chain.id,
    address: lidoSuite.withdrawalQueue,
    abi: withdrawalQueueAbi,
    functionName: 'getLastCheckpointIndex',
    watch: true,
    suspense: true,
  })

  const { data: withdrawalStatuses } = useContractRead({
    chainId: lidoSuite.chain.id,
    address: lidoSuite.withdrawalQueue,
    abi: withdrawalQueueAbi,
    functionName: 'getWithdrawalStatus',
    args: [sortedWithdrawalIds],
    watch: true,
    suspense: true,
  })

  const { data: hints } = useContractRead({
    chainId: lidoSuite.chain.id,
    address: lidoSuite.withdrawalQueue,
    abi: withdrawalQueueAbi,
    functionName: 'findCheckpointHints',
    args: [sortedWithdrawalIds, 1n, lastCheckpointIndex ?? 0n],
    watch: true,
    suspense: true,
  })

  const { data: claimables } = useContractRead({
    chainId: lidoSuite.chain.id,
    address: lidoSuite.withdrawalQueue,
    abi: withdrawalQueueAbi,
    functionName: 'getClaimableEther',
    args: [sortedWithdrawalIds, hints ?? []],
    watch: true,
    suspense: true,
  })

  const withdrawals = withdrawalIds?.map((id, index) => ({
    id: id as bigint,
    status: withdrawalStatuses?.at(index),
    claimable: claimables?.at(index),
  }))

  const tokenPrice = useRecoilValue(tokenPriceState({ coingeckoId: lidoSuite.token.coingeckoId }))

  return filteredAccounts
    .map((account, index) => {
      const balance = Decimal.fromPlanck((balances?.at(index) as bigint) ?? 0n, token?.decimals ?? 0, token?.symbol)

      const accountWithdrawals = withdrawals?.filter(x => x.status?.owner === account.address)
      const unlockings = accountWithdrawals?.filter(x => !x.status?.isClaimed && !x.status?.isFinalized)

      return {
        account,
        balance: Decimal.fromPlanck((balances?.at(index) as bigint) ?? 0n, token?.decimals ?? 0, token?.symbol),
        fiatBalance: balance.toNumber() * tokenPrice,
        totalUnlocking: Decimal.fromPlanck(
          unlockings?.reduce((prev, curr) => prev + (curr.status?.amountOfStETH ?? 0n), 0n),
          token?.decimals ?? 0,
          token?.symbol
        ),
        unlockings: unlockings?.map(unlock => ({
          amount: Decimal.fromPlanck(unlock.status?.amountOfStETH ?? 0n, token?.decimals ?? 0, token?.symbol),
        })),
        claimable: Decimal.fromPlanck(
          accountWithdrawals?.reduce((prev, curr) => prev + (curr.claimable ?? 0n), 0n),
          token?.decimals ?? 0,
          token?.symbol
        ),
      }
    })
    .filter(x => x.balance.planck.gtn(0) || x.totalUnlocking.planck.gtn(0) || x.claimable.planck.gtn(0))
}
