import type { Account } from '../../accounts'
import { useSubstrateApiEndpoint, useTokenAmountFromPlanck, useTokenAmountState } from '../../common/hooks'
import { paymentInfoState, useSubstrateApiState } from '../../common/recoils'
// import { useAvailableBalance } from '@/components/widgets/staking/slpx/AvailableBalances'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { BN } from '@polkadot/util'
import { Decimal } from '@talismn/math'
import { useDeriveState, useQueryMultiState } from '@talismn/react-polkadot-api'
import { BigMath } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useState, useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll, constSelector } from 'recoil'

const useStakeAddForm = ({ account, slpxPair }: { account: Account | undefined; slpxPair: SlpxSubstratePair }) => {
  const [amount, setAmount] = useState<string>('')
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const [api, [accountInfo]] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryMultiState([['system.account', account?.address ?? '']])])
  )

  const originTokenDecimals = 10

  const decimalAmount = useMemo(
    () => (amount.trim() === '' ? undefined : Decimal.fromUserInputOrUndefined(amount, originTokenDecimals)),
    [amount]
  )

  console.log({ decimalAmount })

  const nativeBalance = useMemo(
    () =>
      balances.find(
        x =>
          x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
      ),
    [balances, slpxPair.chainId, slpxPair.nativeToken.symbol]
  )

  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase()),
    [balances, slpxPair.vToken.symbol]
  )

  const transferablePlanck = nativeBalance.sum.planck.transferable

  const mockedTxData = {
    token_id: {
      Token2: 3,
    },

    token_amount: 5100000000,
    remark: '',
    channel_id: '3',
  }

  // @ts-expect-error
  const tx = api.tx.vtokenMinting.mint({ Token2: 0 }, mockedTxData.token_amount, '', '3')

  // const [feeEstimate] = useStakeFormFeeEstimate(account?.address || '', tx) // TODO: Fee estimate is too High

  const mockedFeeEstimate = 1000000000n

  const maxTransferablePlanck = transferablePlanck - mockedFeeEstimate

  const availableBalance = useAvailableBalance({ slpxPair, fee: mockedFeeEstimate })

  const rateLoadable = useSwapRateLoadable(slpxPair.nativeToken.tokenId, slpxPair.vToken.tokenId)

  const rate = rateLoadable.valueMaybe() ?? 0

  const newStakedTotal = Decimal.fromPlanck(
    liquidBalance.sum.planck.total + (decimalAmount?.planck || 0n),
    originTokenDecimals,
    {
      currency: slpxPair.vToken.symbol,
    }
  )

  return { amount, setAmount, maxTransferablePlanck, availableBalance, rate, newStakedTotal }
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
      amount: Decimal.fromPlanck(nativeBalance.sum.planck.transferable - fee, nativeBalance.each.at(0)?.decimals ?? 0, {
        currency: slpxPair.nativeToken.symbol,
      }),
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
