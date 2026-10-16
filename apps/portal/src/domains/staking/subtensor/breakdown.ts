import { bind } from "@react-rxjs/core"
import { BehaviorSubject } from "rxjs"

import type { TokenAmount, TokenAmountFromPlank } from "@/domains/common/hooks/useTokenAmount"

const DEFAULT_MAX_SLIPPAGE = 5.5

const NO_AMOUNT: TokenAmount = {
	decimalAmount: undefined,
	fiatAmount: undefined,
	localizedFiatAmount: undefined,
}

const bittensorSlippage$ = new BehaviorSubject(0)
const maxSlippage$ = new BehaviorSubject(DEFAULT_MAX_SLIPPAGE)
const dTaoConversionRate$ = new BehaviorSubject<TokenAmount>(NO_AMOUNT)
const expectedAlphaAmount$ = new BehaviorSubject<TokenAmount>(NO_AMOUNT)
const feeEstimate$ = new BehaviorSubject<TokenAmount>(NO_AMOUNT)
const netuid$ = new BehaviorSubject(0)
const talismanTokenFee$ = new BehaviorSubject<TokenAmountFromPlank | undefined>(undefined)

export const [useBittensorSlippage] = bind(bittensorSlippage$)
export const [useMaxSlippage] = bind(maxSlippage$)
export const [useDTaoConversionRate] = bind(dTaoConversionRate$)
export const [useExpectedAlphaAmount] = bind(expectedAlphaAmount$)
export const [useFeeEstimate] = bind(feeEstimate$)
export const [useNetuid] = bind(netuid$)
export const [useTalismanTokenFee] = bind(talismanTokenFee$)

export const setBittensorSlippage = (slippage: number) => bittensorSlippage$.next(slippage)
export const setMaxSlippage = (slippage: number) => maxSlippage$.next(slippage)
export const setDTaoConversionRate = (rate: TokenAmount) => dTaoConversionRate$.next(rate)
export const setExpectedAlphaAmount = (amount: TokenAmount) => expectedAlphaAmount$.next(amount)
export const setFeeEstimate = (fee: TokenAmount) => feeEstimate$.next(fee)
export const setNetuid = (netuid: number) => netuid$.next(netuid)
export const setTalismanTokenFee = (fee: TokenAmountFromPlank | undefined) =>
	talismanTokenFee$.next(fee)
