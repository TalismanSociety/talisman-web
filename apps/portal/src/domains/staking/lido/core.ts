import { useQueries, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { useBlockNumber, useConfig } from 'wagmi'
import { getTokenQueryOptions, readContractQueryOptions, readContractsQueryOptions } from 'wagmi/query'

import type { Account } from '@/domains/accounts/recoils'
import { tokenPriceState } from '@/domains/chains/recoils'
import { Decimal } from '@/util/Decimal'

import type { LidoSuite } from './types'
import { lidoTokenAbi, withdrawalQueueAbi } from './abi'

// https://github.com/wevm/wagmi/issues/3855
const serializableBigInt = (value: bigint) => Object.assign(value, { toJSON: () => value.toString() })

export const useStakes = (accounts: Account[], lidoSuite: LidoSuite) => {
  const filteredAccounts = accounts.filter(x => x.type === 'ethereum')

  const config = useConfig()

  // @ts-expect-error
  const firstQueryBatch = useQueries({
    queries: [
      getTokenQueryOptions(config, { chainId: lidoSuite.chain.id, address: lidoSuite.token.address }),
      readContractsQueryOptions(config, {
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
        allowFailure: false,
      }),
      readContractsQueryOptions(config, {
        contracts: filteredAccounts.map(x => ({
          chainId: lidoSuite.chain.id,
          address: lidoSuite.withdrawalQueue,
          abi: withdrawalQueueAbi,
          functionName: 'getWithdrawalRequests',
          args: [x.address],
        })),
        allowFailure: false,
      }),
      readContractQueryOptions(config, {
        chainId: lidoSuite.chain.id,
        address: lidoSuite.withdrawalQueue,
        abi: withdrawalQueueAbi,
        functionName: 'getLastCheckpointIndex',
      }),
    ],
  })

  const [{ data: token }, { data: balances }, { data: withdrawalIds }, { data: lastCheckpointIndex }] = firstQueryBatch

  const sortedWithdrawalIds =
    withdrawalIds
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.flatMap(x => x as any as bigint[])
      .map(serializableBigInt)
      .sort((a, b) => (a > b ? 1 : -1)) ?? []

  const secondQueryBatch = useQueries({
    queries: [
      readContractQueryOptions(config, {
        chainId: lidoSuite.chain.id,
        address: lidoSuite.withdrawalQueue,
        abi: withdrawalQueueAbi,
        functionName: 'getWithdrawalStatus',
        args: [sortedWithdrawalIds],
      }),
      readContractQueryOptions(config, {
        chainId: lidoSuite.chain.id,
        address: lidoSuite.withdrawalQueue,
        abi: withdrawalQueueAbi,
        functionName: 'findCheckpointHints',
        args: [sortedWithdrawalIds, serializableBigInt(1n), serializableBigInt(lastCheckpointIndex ?? 0n)],
      }),
    ],
  })

  const [{ data: withdrawalStatuses }, { data: _hints }] = secondQueryBatch

  const hints = _hints?.map(serializableBigInt)

  const { data: claimables, refetch: refetchClaimables } = useQuery(
    readContractQueryOptions(config, {
      chainId: lidoSuite.chain.id,
      address: lidoSuite.withdrawalQueue,
      abi: withdrawalQueueAbi,
      functionName: 'getClaimableEther',
      args: [sortedWithdrawalIds, hints ?? []],
    })
  )

  const blockNumber = useBlockNumber({ watch: true })

  useEffect(
    () => {
      ;[...firstQueryBatch, ...secondQueryBatch].forEach(query => {
        void query.refetch()
      })
      void refetchClaimables()
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber]
  )

  const withdrawals = withdrawalIds?.map((id, index) => ({
    id: id as bigint,
    status: withdrawalStatuses?.at(index),
    claimable: claimables?.at(index),
  }))

  const tokenPriceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: lidoSuite.token.coingeckoId }))
  const tokenPrice = tokenPriceLoadable.valueMaybe()

  const data = filteredAccounts
    .map((account, index) => {
      const balance = Decimal.fromPlanck((balances?.at(index) as bigint) ?? 0n, token?.decimals ?? 0, {
        currency: token?.symbol,
      })

      const accountWithdrawals = withdrawals?.filter(x => x.status?.owner === account.address)
      const unlockings = accountWithdrawals?.filter(x => !x.status?.isClaimed && !x.status?.isFinalized)

      return {
        account,
        balance: Decimal.fromPlanck((balances?.at(index) as bigint) ?? 0n, token?.decimals ?? 0, {
          currency: token?.symbol,
        }),
        fiatBalance: balance.toNumber() * (tokenPrice ?? 0),
        totalUnlocking: Decimal.fromPlanck(
          unlockings?.reduce((prev, curr) => prev + (curr.status?.amountOfStETH ?? 0n), 0n) ?? 0n,
          token?.decimals ?? 0,
          { currency: token?.symbol }
        ),

        unlockings: unlockings?.map(unlock => ({
          amount: Decimal.fromPlanck(unlock.status?.amountOfStETH ?? 0n, token?.decimals ?? 0, {
            currency: token?.symbol,
          }),
        })),
        claimable: Decimal.fromPlanck(
          accountWithdrawals?.reduce((prev, curr) => prev + (curr.claimable ?? 0n), 0n) ?? 0n,
          token?.decimals ?? 0,
          { currency: token?.symbol }
        ),
      }
    })
    .filter(x => x.balance.planck > 0 || x.totalUnlocking.planck > 0 || x.claimable.planck > 0)

  return {
    data,
    isLoading:
      firstQueryBatch.some(x => x.isLoading) ||
      secondQueryBatch.some(x => x.isLoading) ||
      tokenPriceLoadable.state === 'loading',
  }
}
