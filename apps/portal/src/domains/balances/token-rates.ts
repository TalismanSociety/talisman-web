import { bind } from "@react-rxjs/core"
import type { TokenId, TokenList } from "@talismn/chaindata-provider"
import { fetchTokenRates, type TokenRateCurrency, type TokenRatesList } from "@talismn/token-rates"
import { isEqual } from "lodash"
import {
	catchError,
	combineLatest,
	concat,
	defer,
	distinctUntilChanged,
	exhaustMap,
	filter,
	map,
	type Observable,
	of,
	retry,
	scan,
	shareReplay,
	startWith,
	switchMap,
	throwError,
	timer,
} from "rxjs"

import { tokensById$ } from "@/domains/chains/chaindata-provider"
import { SEEK_TOKEN } from "@/domains/staking/seek/constants"
import { toLoadable } from "@/util/loadable"

import { readBalancesCache } from "./balances-cache"
import { currencyConfig, selectedCurrency$ } from "./currency"

const RATE_CURRENCIES = Object.keys(currencyConfig) as TokenRateCurrency[]
const RATES_POLL_INTERVAL = 300_000
const RATES_RETRY_DELAY = 5_000

type TokenRatesState = { rates: TokenRatesList; settled: boolean }

const pricedTokens$ = tokensById$.pipe(
	map((tokens): TokenList => ({ ...tokens, [SEEK_TOKEN.id]: SEEK_TOKEN })),
	distinctUntilChanged(isEqual)
)

const settle = (state: TokenRatesState, fetched: TokenRatesList | undefined): TokenRatesState => ({
	rates: fetched === undefined ? state.rates : { ...state.rates, ...fetched },
	settled: true,
})

const pollTokenRates$ = (
	tokens: TokenList,
	initial: TokenRatesState
): Observable<TokenRatesState> =>
	timer(0, RATES_POLL_INTERVAL).pipe(
		exhaustMap(() =>
			defer(() => fetchTokenRates(tokens, RATE_CURRENCIES)).pipe(
				catchError((error) =>
					concat(
						of(undefined),
						throwError(() => error)
					)
				),
				retry({ delay: RATES_RETRY_DELAY })
			)
		),
		scan(settle, initial),
		startWith(initial)
	)

const tokenRatesState$ = pricedTokens$.pipe(
	switchMap((tokens) =>
		pollTokenRates$(tokens, { rates: readBalancesCache().tokenRates, settled: false })
	),
	shareReplay({ bufferSize: 1, refCount: true })
)

export const tokenRates$ = tokenRatesState$.pipe(
	map(({ rates }) => rates),
	distinctUntilChanged()
)

export const tokenPrice$ = (tokenId: TokenId): Observable<number> =>
	combineLatest([tokenRatesState$, selectedCurrency$]).pipe(
		filter(([{ rates, settled }]) => settled || rates[tokenId] !== undefined),
		map(([{ rates }, currency]) => rates[tokenId]?.[currency]?.price ?? 0),
		distinctUntilChanged()
	)

export const [useTokenPriceLoadable] = bind((tokenId: TokenId) => toLoadable(tokenPrice$(tokenId)))
