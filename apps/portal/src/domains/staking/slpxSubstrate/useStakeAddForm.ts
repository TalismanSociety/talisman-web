import { useSubstrateApiState } from '../../common/recoils'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { useExtrinsic } from '@/domains/common/hooks'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@talismn/math'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useState, useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const useStakeAddForm = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const [amount, setAmount] = useState<string>('')
  const valueLoadable = useRecoilValueLoadable(waitForAll([selectedBalancesState, useSubstrateApiState()]))
  const [balances, api] = valueLoadable.valueMaybe() ?? []

  const originTokenDecimals = 10
  const remark = import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'
  const channelId = '3'

  const decimalAmount = useMemo(
    () => (amount.trim() === '' ? undefined : Decimal.fromUserInputOrUndefined(amount, originTokenDecimals)),
    [amount]
  )

  const liquidBalance = useMemo(
    () => balances?.find(x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase()),
    [balances, slpxPair.vToken.symbol]
  )

  const tx = useMemo(
    // @ts-expect-error
    () => api?.tx.vtokenMinting.mint(slpxPair.nativeToken.tokenId, decimalAmount?.planck ?? 0n, remark, channelId),
    [api?.tx.vtokenMinting, decimalAmount?.planck, remark, slpxPair.nativeToken.tokenId]
  )

  const extrinsic = useExtrinsic(tx)

  // const [feeEstimate] = useStakeFormFeeEstimate(account?.address || '', tx) // TODO: Fee estimate is too High

  const mockedFeeEstimate = 1000000000n

  const availableBalance = useAvailableBalance({ slpxPair, fee: mockedFeeEstimate })

  const rateLoadable = useSwapRateLoadable(slpxPair.nativeToken.tokenId, slpxPair.vToken.tokenId)

  const rate = rateLoadable.valueMaybe() ?? 0

  const newStakedTotal = Decimal.fromPlanck(
    (liquidBalance?.sum.planck.total ?? 0n) +
      ((decimalAmount?.planck || 0n) * BigInt(Math.floor(rate * 1000))) / BigInt(1000),
    originTokenDecimals,
    {
      currency: slpxPair.vToken.symbol,
    }
  )

  const minAmount = Decimal.fromPlanck(slpxPair.minStake, originTokenDecimals, {
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

  return { amount, setAmount, availableBalance, rate, newStakedTotal, extrinsic, error }
}

export default useStakeAddForm

const useAvailableBalance = ({ slpxPair, fee }: { slpxPair: SlpxSubstratePair; fee: bigint }) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const recoilCurrency = useRecoilValue(selectedCurrencyState)
  const nativeBalance = balances.find(
    x => x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
  )

  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(nativeBalance.sum.planck.transferable, nativeBalance.each.at(0)?.decimals ?? 0, {
        currency: slpxPair.nativeToken.symbol,
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
    [currency, fee, nativeBalance.each, nativeBalance.sum, recoilCurrency, slpxPair.nativeToken.symbol]
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

// export const useStakeFormFeeEstimate = (origin: string, tx: SubmittableExtrinsic<any>) => {
//   const paymentInfoLoadable = useRecoilValueLoadable(
//     paymentInfoState([
//       useSubstrateApiEndpoint(),
//       // @ts-expect-error
//       tx.method.section,
//       // @ts-expect-error
//       tx.method.method,
//       origin,
//       ...tx.args,
//     ])
//   )

//   return useMemo(
//     () =>
//       [
//         BigInt(paymentInfoLoadable.valueMaybe()?.partialFee?.toString(10) || '0'),
//         paymentInfoLoadable.state === 'hasValue',
//       ] as const,
//     [paymentInfoLoadable]
//   )
// }
