import { Maybe } from '../../../util/monads'
import { useSubstrateApiState } from '../../common/recoils'
import { SlpxSubstratePair } from './types'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { tokenPriceState } from '@/domains/chains'
import { Decimal } from '@talismn/math'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useState, useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const useStakeRemoveForm = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const [amount, setAmount] = useState<string>('')
  const [balances, api] = useRecoilValue(waitForAll([selectedBalancesState, useSubstrateApiState()]))
  const originTokenRate = useRecoilValueLoadable(tokenPriceState({ coingeckoId: slpxPair.vToken.coingeckoId }))
  const currency = useRecoilValue(selectedCurrencyState)

  const originTokenDecimals = 10

  const decimalAmount = useMemo(
    () => (amount.trim() === '' ? undefined : Decimal.fromUserInputOrUndefined(amount, originTokenDecimals)),
    [amount]
  )

  // const nativeBalance = useMemo(
  //   () =>
  //     balances.find(
  //       x =>
  //         x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
  //     ),
  //   [balances, slpxPair.chainId, slpxPair.nativeToken.symbol]
  // )

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

  const rateLoadable = useSwapRateLoadable(slpxPair.nativeToken.tokenId, slpxPair.vToken.tokenId)

  const rate = rateLoadable.valueMaybe() ?? 0

  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase()),
    [balances, slpxPair.vToken.symbol]
  )

  const localizedFiatAmount = useMemo(
    () =>
      Maybe.of(
        originTokenRate.state !== 'hasValue' ? undefined : (decimalAmount?.toNumber() ?? 0) * originTokenRate.contents
      ).mapOrUndefined(x => x.toLocaleString(undefined, { style: 'currency', currency })),
    [currency, decimalAmount, originTokenRate.contents, originTokenRate.state]
  )

  const newAmount = Decimal.fromPlanck(
    (liquidBalance.sum.planck.total ?? 0n) - (decimalAmount?.planck ?? 0n),
    originTokenDecimals,
    { currency: slpxPair.vToken.symbol }
  )

  return { amount, setAmount, localizedFiatAmount, newAmount, rate }
}

export default useStakeRemoveForm
