import '@bifrost-finance/types/augment/api'
import type { Account } from '@domains/accounts'
import { selectedCurrencyState } from '@domains/balances'
import { tokenPriceState } from '@domains/chains'
import { useSubstrateApiState, useWagmiContractWrite } from '@domains/common'
import { evmToAddress } from '@polkadot/util-crypto'
import { Decimal } from '@talismn/math'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import type BN from 'bn.js'
import { useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import { isAddress } from 'viem'
import { erc20ABI, useContractRead, useContractReads, useToken, useWaitForTransaction } from 'wagmi'
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

  const balance = useContractRead({
    chainId,
    address: originToken?.address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    enabled: account?.address !== undefined,
  })

  const available = useMemo(
    () =>
      Maybe.of(balance.data).mapOrUndefined(x =>
        Decimal.fromPlanck(x, originToken?.decimals ?? 0, originToken?.symbol)
      ),
    [balance.data, originToken?.decimals, originToken?.symbol]
  )

  const existingOriginTokenAmount = useContractRead({
    chainId,
    address: originToken?.address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    enabled: account?.address !== undefined,
  })

  const existingDestTokenAmount = useContractRead({
    chainId,
    address: destToken?.address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [account?.address ?? '0x'],
    enabled: account?.address !== undefined,
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
      decimalAmount.planck.muln(rateLoadable.contents),
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
      (existingOriginTokenAmount.data ?? 0n) - BigInt(decimalAmount.planck.toString()),
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
      (existingDestTokenAmount.data ?? 0n) + BigInt(receivingAmount?.planck.toString() ?? 0),
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

  const assetInfo = useContractRead({
    chainId,
    address: splxContractAddress,
    abi: slpx,
    functionName: 'addressToAssetInfo',
    args: [originToken?.address ?? '0x'],
    enabled: originToken?.address !== undefined,
  })

  const minAmount = useMemo(
    () =>
      Maybe.of(assetInfo.data?.[1]).mapOrUndefined(x =>
        Decimal.fromPlanck(x, originToken?.decimals ?? 0, originToken?.symbol)
      ),
    [assetInfo.data, originToken?.decimals, originToken?.symbol]
  )

  const error = useMemo(() => {
    if (decimalAmount !== undefined && available !== undefined && decimalAmount.planck.gt(available.planck)) {
      return new Error('Insufficient balance')
    }

    if (decimalAmount !== undefined && minAmount !== undefined && decimalAmount.planck.lt(minAmount.planck)) {
      return new Error(`Minimum ${minAmount.toHuman()} needed`)
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

  const planckAmount = useMemo(
    () => Maybe.of(base.input.decimalAmount?.planck).mapOrUndefined(x => BigInt(x.toString())),
    [base.input.decimalAmount?.planck]
  )

  const allowance = useContractRead({
    chainId: slpxPair.chain.id,
    address: slpxPair.vToken.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [account?.address ?? '0x', slpxPair.splx],
    enabled: account?.address !== undefined,
  })

  const redeem = useWagmiContractWrite({
    chainId: slpxPair.chain.id,
    address: slpxPair.splx,
    abi: slpx,
    functionName: 'redeemAsset',
    args: [slpxPair.vToken.address, planckAmount ?? 0n, account?.address ?? '0x'],
    etherscanUrl: slpxPair.etherscanUrl,
  })

  const approve = useWagmiContractWrite({
    chainId: slpxPair.chain.id,
    address: slpxPair.vToken.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [slpxPair.splx, planckAmount ?? 0n],
    etherscanUrl: slpxPair.etherscanUrl,
  })

  const approveTransaction = useWaitForTransaction({
    chainId: slpxPair.chain.id,
    hash: approve.data?.hash,
    onSettled: () => {
      void allowance.refetch()
    },
  })

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

  const planckAmount = useMemo(
    () => Maybe.of(base.input.decimalAmount?.planck).mapOrUndefined(x => BigInt(x.toString())),
    [base.input.decimalAmount?.planck]
  )

  const mint = useWagmiContractWrite({
    chainId: slpxPair.chain.id,
    address: slpxPair.splx,
    abi: slpx,
    functionName: 'mintVNativeAsset',
    args: [account?.address ?? '0x', import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'],
    value: planckAmount ?? 0n,
    etherscanUrl: slpxPair.etherscanUrl,
  })

  return {
    ...base,
    mint,
  }
}

export const useStakes = (accounts: Account[], slpxPair: SlpxPair) => {
  const filteredAccounts = useMemo(() => accounts.filter(x => x.type === 'ethereum'), [accounts])

  const vToken = useToken({ chainId: slpxPair.chain.id, address: slpxPair.vToken.address, suspense: true })

  const balances = useContractReads({
    contracts: filteredAccounts.map(x => ({
      chainId: slpxPair.chain.id,
      address: slpxPair.vToken.address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [x.address],
    })),
    watch: true,
    suspense: true,
  })

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
          Decimal.fromPlanck(x[0], vToken.data?.decimals ?? 0, vToken.data?.symbol)
        ),
      }
    })
    .filter(x => !x.balance.planck.isZero() || !x.unlocking?.planck.isZero())
}
