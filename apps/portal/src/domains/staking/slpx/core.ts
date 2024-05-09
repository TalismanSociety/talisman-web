import '@bifrost-finance/types/augment/api'
import type { Account } from '@domains/accounts'
import { selectedCurrencyState } from '@domains/balances'
import { tokenPriceState } from '@domains/chains'
import { useSubstrateApiState, useWagmiWriteContract } from '@domains/common'
import { evmToAddress } from '@polkadot/util-crypto'
import { Decimal } from '@talismn/math'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { useSuspenseQueries } from '@tanstack/react-query'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import { erc20Abi, isAddress } from 'viem'
import { useBlockNumber, useConfig, useReadContract, useToken, useWaitForTransactionReceipt } from 'wagmi'
import { getTokenQueryOptions, readContractsQueryOptions } from 'wagmi/query'
import slpx from './abi'
import type { SlpxPair, SlpxToken } from './types'

export const useVTokenUnlockDuration = (slpxPair: SlpxPair) => {
  const unlockDuration = useRecoilValue(
    useQueryState('vtokenMinting', 'unlockDuration', [slpxPair.nativeToken.tokenId])
  )

  return useMemo(() => {
    const rounds: BN = unlockDuration.unwrapOrDefault().asRound.unwrap()
    return rounds.muln(slpxPair.estimatedRoundDuration).toNumber()
  }, [slpxPair.estimatedRoundDuration, unlockDuration])
}

const useSwapRateLoadable = (tokenId: any, vTokenId: any, reverse?: boolean) => {
  const loadable = useRecoilValueLoadable(
    useQueryMultiState([
      ['tokens.totalIssuance', vTokenId],
      ['vtokenMinting.tokenPool', tokenId],
    ])
  )

  return loadable.map(([totalIssuance, staked]) => {
    const rate = new BigNumber(totalIssuance.toString()).div(staked.toString()).toNumber()

    return reverse ? 1 / rate : rate
  })
}

export const useSlpxSwapForm = (
  account: Account | undefined,
  chainId: number,
  splxContractAddress: `0x${string}`,
  originTokenConfig: SlpxToken,
  destTokenConfig: SlpxToken
) => {
  if (account?.address !== undefined && !isAddress(account.address)) {
    throw new Error(`Invalid EVM address ${account.address}`)
  }

  const { data: originToken } = useToken({ chainId, address: originTokenConfig.address })
  const { data: destToken } = useToken({ chainId, address: destTokenConfig.address })

  const [amount, setAmount] = useState('')

  const decimalAmount = useMemo(
    () => (amount.trim() === '' ? undefined : Decimal.fromUserInputOrUndefined(amount, originToken?.decimals ?? 0)),
    [amount, originToken?.decimals]
  )

  const originTokenRate = useRecoilValueLoadable(tokenPriceState({ coingeckoId: originTokenConfig.coingeckoId }))

  const currency = useRecoilValue(selectedCurrencyState)

  const localizedFiatAmount = useMemo(
    () =>
      Maybe.of(
        originTokenRate.state !== 'hasValue' ? undefined : (decimalAmount?.toNumber() ?? 0) * originTokenRate.contents
      ).mapOrUndefined(x => x.toLocaleString(undefined, { style: 'currency', currency })),
    [currency, decimalAmount, originTokenRate.contents, originTokenRate.state]
  )

  const balance = useReadContract({
    chainId,
    address: originToken?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    query: {
      enabled: account?.address !== undefined,
    },
  })

  const available = useMemo(
    () =>
      Maybe.of(balance.data).mapOrUndefined(x =>
        Decimal.fromPlanck(x, originToken?.decimals ?? 0, originToken?.symbol)
      ),
    [balance.data, originToken?.decimals, originToken?.symbol]
  )

  const existingOriginTokenAmount = useReadContract({
    chainId,
    address: originToken?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    query: {
      enabled: account?.address !== undefined,
    },
  })

  const existingDestTokenAmount = useReadContract({
    chainId,
    address: destToken?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    query: {
      enabled: account?.address !== undefined,
    },
  })

  const rateLoadable = useSwapRateLoadable(
    originTokenConfig.type === 'token' ? originTokenConfig.tokenId : destTokenConfig.tokenId,
    originTokenConfig.type === 'vToken' ? originTokenConfig.tokenId : destTokenConfig.tokenId,
    destTokenConfig.type === 'token'
  )

  const receivingAmount = useMemo(() => {
    if (decimalAmount === undefined || rateLoadable.state !== 'hasValue') {
      return undefined
    }

    return Decimal.fromPlanck(
      new BN(decimalAmount.planck.toString()).muln(rateLoadable.contents).toString(),
      destToken?.decimals ?? 0,
      destToken?.symbol
    )
  }, [decimalAmount, destToken?.decimals, destToken?.symbol, rateLoadable.contents, rateLoadable.state])

  const newOriginTokenAmount = useMemo(() => {
    if (existingOriginTokenAmount.isFetched && decimalAmount === undefined) {
      return Decimal.fromPlanck(existingOriginTokenAmount.data ?? 0n, originToken?.decimals ?? 0, originToken?.symbol)
    }

    if (!existingOriginTokenAmount.isFetched || decimalAmount === undefined) {
      return undefined
    }

    return Decimal.fromPlanck(
      (existingOriginTokenAmount.data ?? 0n) - decimalAmount.planck,
      originToken?.decimals ?? 0,
      originToken?.symbol
    )
  }, [
    decimalAmount,
    existingOriginTokenAmount.data,
    existingOriginTokenAmount.isFetched,
    originToken?.decimals,
    originToken?.symbol,
  ])

  const newDestTokenAmount = useMemo(() => {
    if (existingDestTokenAmount.isFetched && receivingAmount === undefined) {
      return Decimal.fromPlanck(existingDestTokenAmount.data ?? 0n, destToken?.decimals ?? 0, destToken?.symbol)
    }

    if (!existingDestTokenAmount.isFetched || receivingAmount === undefined) {
      return undefined
    }

    return Decimal.fromPlanck(
      (existingDestTokenAmount.data ?? 0n) + receivingAmount.planck,
      destToken?.decimals ?? 0,
      destToken?.symbol
    )
  }, [
    destToken?.decimals,
    destToken?.symbol,
    existingDestTokenAmount.data,
    existingDestTokenAmount.isFetched,
    receivingAmount,
  ])

  const assetInfo = useReadContract({
    chainId,
    address: splxContractAddress,
    abi: slpx,
    functionName: 'addressToAssetInfo',
    args: [originToken?.address ?? '0x'],
    query: {
      enabled: originToken?.address !== undefined,
    },
  })

  const minAmount = useMemo(
    () =>
      Maybe.of(assetInfo.data?.[1]).mapOrUndefined(x =>
        Decimal.fromPlanck(x, originToken?.decimals ?? 0, originToken?.symbol)
      ),
    [assetInfo.data, originToken?.decimals, originToken?.symbol]
  )

  const error = useMemo(() => {
    if (decimalAmount !== undefined && available !== undefined && decimalAmount.planck > available.planck) {
      return new Error('Insufficient balance')
    }

    if (decimalAmount !== undefined && minAmount !== undefined && decimalAmount.planck < minAmount.planck) {
      return new Error(`Minimum ${minAmount.toLocaleString()} needed`)
    }

    return undefined
  }, [available, decimalAmount, minAmount])

  const ready = useMemo(
    () =>
      error === undefined &&
      decimalAmount !== undefined &&
      balance.isFetched &&
      existingDestTokenAmount.isFetched &&
      rateLoadable.state === 'hasValue' &&
      assetInfo.isFetched,
    [
      assetInfo.isFetched,
      balance.isFetched,
      decimalAmount,
      error,
      existingDestTokenAmount.isFetched,
      rateLoadable.state,
    ]
  )

  return {
    input: { amount, decimalAmount, localizedFiatAmount },
    setAmount,
    rate: rateLoadable.valueMaybe(),
    receivingAmount,
    newOriginTokenAmount,
    newDestTokenAmount,
    available,
    ready,
    error,
  }
}

export const useRedeemForm = (account: Account | undefined, slpxPair: SlpxPair) => {
  if (account?.address !== undefined && !isAddress(account.address)) {
    throw new Error(`Invalid EVM address ${account.address}`)
  }

  const base = useSlpxSwapForm(account, slpxPair.chain.id, slpxPair.splx, slpxPair.vToken, slpxPair.nativeToken)

  const planckAmount = base.input.decimalAmount?.planck

  const allowance = useReadContract({
    chainId: slpxPair.chain.id,
    address: slpxPair.vToken.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account?.address ?? '0x', slpxPair.splx],
    query: {
      enabled: account?.address !== undefined,
    },
  })

  const _redeem = useWagmiWriteContract()
  const redeem = {
    ..._redeem,
    writeContractAsync: async () =>
      await _redeem.writeContractAsync({
        chainId: slpxPair.chain.id,
        address: slpxPair.splx,
        abi: slpx,
        functionName: 'redeemAsset',
        args: [slpxPair.vToken.address, planckAmount ?? 0n, (account?.address as `0x${string}`) ?? '0x'],
        etherscanUrl: slpxPair.etherscanUrl,
      }),
  }

  const _approve = useWagmiWriteContract()
  const approve = {
    ..._approve,
    writeContractAsync: async () =>
      await _approve.writeContractAsync({
        chainId: slpxPair.chain.id,
        address: slpxPair.vToken.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [slpxPair.splx, planckAmount ?? 0n],
        etherscanUrl: slpxPair.etherscanUrl,
      }),
  }

  const approveTransaction = useWaitForTransactionReceipt({
    chainId: slpxPair.chain.id,
    hash: approve.data,
  })

  useEffect(() => {
    if (approveTransaction.data?.status === 'success') {
      void allowance.refetch()
    }
  }, [allowance, approveTransaction.data?.status])

  const approvalNeeded = useMemo(
    () => allowance.data !== undefined && planckAmount !== undefined && allowance.data < planckAmount,
    [allowance.data, planckAmount]
  )

  return {
    ...base,
    approvalNeeded,
    approve,
    approveTransaction,
    redeem,
    ready: useMemo(() => base.ready && allowance.isFetched, [allowance.isFetched, base.ready]),
  }
}

export const useMintForm = (account: Account | undefined, slpxPair: SlpxPair) => {
  if (account?.address !== undefined && !isAddress(account.address)) {
    throw new Error(`Invalid EVM address ${account.address}`)
  }

  const base = useSlpxSwapForm(account, slpxPair.chain.id, slpxPair.splx, slpxPair.nativeToken, slpxPair.vToken)

  const planckAmount = base.input.decimalAmount?.planck

  const _mint = useWagmiWriteContract()
  const mint = {
    ..._mint,
    writeContractAsync: async () =>
      await _mint.writeContractAsync({
        chainId: slpxPair.chain.id,
        address: slpxPair.splx,
        abi: slpx,
        functionName: 'mintVNativeAsset',
        args: [(account?.address as `0x${string}`) ?? '0x', import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'],
        value: planckAmount ?? 0n,
        etherscanUrl: slpxPair.etherscanUrl,
      }),
  }

  return {
    ...base,
    mint,
  }
}

export const useStakes = (accounts: Account[], slpxPair: SlpxPair) => {
  const filteredAccounts = useMemo(() => accounts.filter(x => x.type === 'ethereum'), [accounts])

  const { data: blockNumber } = useBlockNumber({ watch: true })

  const config = useConfig()

  const [vToken, balances] = useSuspenseQueries({
    queries: [
      getTokenQueryOptions(config, { chainId: slpxPair.chain.id, address: slpxPair.vToken.address }),
      readContractsQueryOptions(config, {
        contracts: filteredAccounts.map(x => ({
          chainId: slpxPair.chain.id,
          address: slpxPair.vToken.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [x.address],
        })),
      }),
    ],
  })

  useEffect(
    () => {
      void vToken.refetch()
      void balances.refetch()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber]
  )

  const api = useRecoilValue(useSubstrateApiState())
  const [tokenPrice, userUnlockLedgers] = useRecoilValue(
    waitForAll([
      tokenPriceState({ coingeckoId: slpxPair.vToken.coingeckoId }),
      useQueryState(
        'vtokenMinting',
        'userUnlockLedger.multi',
        filteredAccounts.map(
          x => [evmToAddress(x.address, api.registry.chainSS58), slpxPair.nativeToken.tokenId] as const
        )
      ),
    ])
  )

  return filteredAccounts
    .map((account, index) => {
      const balance = Decimal.fromPlanck(
        (balances.data?.[index]?.result as bigint) ?? 0n,
        vToken.data?.decimals ?? 0,
        vToken.data?.symbol
      )
      return {
        account,
        balance,
        fiatBalance: balance.toNumber() * tokenPrice,
        unlocking: Maybe.of(userUnlockLedgers[index]?.unwrapOrDefault()).mapOrUndefined(x =>
          Decimal.fromPlanck(x[0].toBigInt(), vToken.data?.decimals ?? 0, vToken.data?.symbol)
        ),
      }
    })
    .filter(x => x.balance.planck !== 0n || (x.unlocking !== undefined && x.unlocking.planck !== 0n))
}
