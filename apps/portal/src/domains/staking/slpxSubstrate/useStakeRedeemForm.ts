import { useSubstrateApiState } from '../../common/recoils'
import { SlpxSubstratePair } from './types'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { useExtrinsic } from '@/domains/common/hooks'
import { Decimal } from '@talismn/math'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useState, useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const useStakeRedeemForm = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const [amount, setAmount] = useState<string>('')

  const valueLoadable = useRecoilValueLoadable(waitForAll([selectedBalancesState, useSubstrateApiState()]))
  const [balances, api] = valueLoadable.valueMaybe() ?? []

  const originTokenDecimals = 10

  const decimalAmount = useMemo(
    () => (amount.trim() === '' ? undefined : Decimal.fromUserInputOrUndefined(amount, originTokenDecimals)),
    [amount]
  )

  const tx = useMemo(
    () => api?.tx.vtokenMinting.redeem(slpxPair.vToken.tokenId, decimalAmount?.planck ?? 0n),
    [api?.tx.vtokenMinting, decimalAmount?.planck, slpxPair.vToken.tokenId]
  )
  const extrinsic = useExtrinsic(tx)

  const availableBalance = useAvailableBalance({ slpxPair, fee: 0n })

  const rateLoadable = useSwapRateLoadable(slpxPair.nativeToken.tokenId, slpxPair.vToken.tokenId, true)

  const rate = rateLoadable.valueMaybe() ?? 0

  const liquidBalance = useMemo(
    () => balances?.find(x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase()),
    [balances, slpxPair.vToken.symbol]
  )

  const newAmount = Decimal.fromPlanck(
    (liquidBalance?.sum.planck.total ?? 0n) - (decimalAmount?.planck ?? 0n),
    originTokenDecimals,
    { currency: slpxPair.vToken.symbol }
  )

  const minAmount = Decimal.fromPlanck(slpxPair.minRedeem, originTokenDecimals, {
    currency: slpxPair.nativeToken.symbol,
  })

  const error = useMemo(() => {
    if (
      decimalAmount !== undefined &&
      availableBalance !== undefined &&
      decimalAmount.planck > availableBalance.amountAfterFee.planck
    ) {
      return new Error('Insufficient balance')
    }

    if (decimalAmount !== undefined && minAmount !== undefined && decimalAmount.planck < minAmount.planck) {
      return new Error(`Minimum ${minAmount.toLocaleString()} needed`)
    }

    return undefined
  }, [availableBalance, decimalAmount, minAmount])

  return { amount, setAmount, newAmount, rate, availableBalance, extrinsic, error }
}

export default useStakeRedeemForm

const useAvailableBalance = ({ slpxPair, fee }: { slpxPair: SlpxSubstratePair; fee: bigint }) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const recoilCurrency = useRecoilValue(selectedCurrencyState)
  const nativeBalance = balances.find(
    x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
  )

  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(nativeBalance.sum.planck.transferable - fee, nativeBalance.each.at(0)?.decimals ?? 0, {
        currency: slpxPair.vToken.symbol,
      }),
      amountAfterFee: Decimal.fromPlanck(
        nativeBalance.sum.planck.transferable - fee,
        nativeBalance.each.at(0)?.decimals ?? 0,
        {
          currency: slpxPair.nativeToken.symbol,
        }
      ),
      fiatAmount: Intl.NumberFormat('en', {
        style: 'currency',
        notation: 'compact',
        maximumFractionDigits: 2,
        currency: recoilCurrency,
      }).format(nativeBalance.sum.fiat(currency).total),
    }),
    [
      currency,
      fee,
      nativeBalance.each,
      nativeBalance.sum,
      recoilCurrency,
      slpxPair.nativeToken.symbol,
      slpxPair.vToken.symbol,
    ]
  )
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
