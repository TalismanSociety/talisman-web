import { bind } from "@react-rxjs/core"
import { Balances, BalancesProvider, type BalancesResult, type IBalance } from "@talismn/balances"
import { subNativeTokenId, type TokenId, type TokenList } from "@talismn/chaindata-provider"
import { fetchTokenRates, type TokenRateCurrency, type TokenRatesList } from "@talismn/token-rates"
import { encodeAnyAddress } from "@talismn/util"
import { isEqual } from "lodash"
import {
	BehaviorSubject,
	combineLatest,
	debounceTime,
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
	tap,
	timer,
} from "rxjs"

import { chainConnectors } from "@/domains/chains/chain-connectors"
import { chaindataProvider, networksById$, tokensById$ } from "@/domains/chains/chaindata-provider"

import { keepAddresses, readBalancesCache, writeBalancesCache } from "./balances-cache"
import { currencyConfig } from "./currency"
import {
	BITTENSOR_NETWORK_ID,
	type SubtensorStakesByAddress,
	subtensorStakes$,
} from "./subtensor-stakes"

const RATE_CURRENCIES = Object.keys(currencyConfig) as TokenRateCurrency[]
const RATES_POLL_INTERVAL = 300_000
const RATES_RETRY_DELAY = 5_000
const NO_BALANCES: BalancesResult = { status: "live", balances: [], failedBalanceIds: [] }
const BITTENSOR_NATIVE_TOKEN_ID = subNativeTokenId(BITTENSOR_NETWORK_ID)
const CACHE_WRITE_DEBOUNCE = 1_000

const cache = readBalancesCache()

const balancesProvider = new BalancesProvider(chaindataProvider, chainConnectors, {
	balances: cache.balances,
	miniMetadatas: [],
})

const addresses$ = new BehaviorSubject<string[]>([])
const cacheableAddresses$ = new BehaviorSubject<string[]>([])
const tokenIds$ = new BehaviorSubject<TokenId[]>([])

export const setBalancesAddresses = (addresses: string[]) => addresses$.next(addresses)
export const setCacheableBalancesAddresses = (addresses: string[]) =>
	cacheableAddresses$.next(addresses)
export const setBalancesTokenIds = (tokenIds: TokenId[]) => tokenIds$.next(tokenIds)

const pollTokenRates$ = (tokens: TokenList): Observable<TokenRatesList> =>
	timer(0, RATES_POLL_INTERVAL).pipe(
		exhaustMap(() =>
			defer(() => fetchTokenRates(tokens, RATE_CURRENCIES)).pipe(
				retry({ delay: RATES_RETRY_DELAY })
			)
		),
		scan((previous, next) => ({ ...previous, ...next }), cache.tokenRates),
		startWith(cache.tokenRates)
	)

const tokenRates$ = tokensById$.pipe(
	distinctUntilChanged(isEqual),
	switchMap((tokens) => pollTokenRates$(tokens)),
	shareReplay({ bufferSize: 1, refCount: true })
)

const addressesByTokenId$ = combineLatest([addresses$, tokenIds$, tokensById$, networksById$]).pipe(
	map(([addresses, tokenIds, tokens, networks]) =>
		Object.fromEntries(
			addresses.length === 0
				? []
				: tokenIds
						.filter((id) => {
							const token = tokens[id]
							return token !== undefined && !networks[token.networkId]?.isTestnet
						})
						.map((id) => [id, addresses])
		)
	),
	distinctUntilChanged(isEqual)
)

const balancesResult$ = addressesByTokenId$.pipe(
	switchMap((addressesByTokenId) =>
		Object.keys(addressesByTokenId).length === 0
			? of(NO_BALANCES)
			: balancesProvider.getBalances$(addressesByTokenId)
	)
)

const stakes$ = addressesByTokenId$.pipe(
	map((addressesByTokenId) => addressesByTokenId[BITTENSOR_NATIVE_TOKEN_ID] ?? []),
	distinctUntilChanged(isEqual),
	switchMap(subtensorStakes$),
	startWith(cache.subtensorStakes),
	shareReplay({ bufferSize: 1, refCount: true })
)

const withSubtensorStakes = (
	balance: IBalance,
	stakesByAddress: SubtensorStakesByAddress
): IBalance => {
	const stakes =
		balance.tokenId === BITTENSOR_NATIVE_TOKEN_ID
			? stakesByAddress.get(encodeAnyAddress(balance.address))
			: undefined
	return stakes ? { ...balance, values: [...(balance.values ?? []), ...stakes] } : balance
}

const toBalances = (
	result: BalancesResult,
	stakesByAddress: SubtensorStakesByAddress,
	hydrate: ConstructorParameters<typeof Balances>[1]
): Balances =>
	new Balances(
		result.balances.map((balance) => withSubtensorStakes(balance, stakesByAddress)),
		hydrate
	).find((balance) => balance.token !== null && balance.total.planck !== 0n)

export const [useBalances] = bind(
	combineLatest([balancesResult$, stakes$, networksById$, tokensById$, tokenRates$]).pipe(
		map(([result, stakesByAddress, networks, tokens, tokenRates]) =>
			toBalances(result, stakesByAddress, { networks, tokens, tokenRates })
		)
	)
)

export const balancesCacheWrites$ = combineLatest([
	cacheableAddresses$,
	balancesProvider.storage$,
	stakes$,
	tokenRates$,
]).pipe(
	filter(([addresses]) => addresses.length > 0),
	debounceTime(CACHE_WRITE_DEBOUNCE),
	map(([addresses, { balances }, subtensorStakes, tokenRates]) =>
		keepAddresses({ balances, subtensorStakes, tokenRates }, addresses)
	),
	tap(writeBalancesCache)
)
