import { bind } from "@react-rxjs/core"
import type { DotNetwork, Token } from "@talismn/chaindata-provider"
import { useContext } from "react"
import { combineLatest, map, type Observable, of, shareReplay, switchMap, take } from "rxjs"
import { z } from "zod"

import { selectedCurrency$ } from "@/domains/balances/currency"
import { tokenPrice$ } from "@/domains/balances/token-rates"
import { Decimal } from "@/util/Decimal"
import { getCachedQuery$ } from "@/util/getCachedQuery"
import { bindSuspended, type Loadable, toLoadable } from "@/util/loadable"
import { nullToUndefined } from "@/util/nullToUndefined"
import { persistedState } from "@/util/persistedState"

import { networksByGenesisHash$, tokensById$ } from "./chaindata-provider"
import { chainConfigs } from "./config"
import { ChainContext } from "./contexts"
import { isSubscanUrl } from "./utils"

const toChainInfo = (
	genesisHash: string,
	networks: Record<`0x${string}`, DotNetwork>,
	tokens: Record<string, Token>
) => {
	const network = networks[genesisHash as `0x${string}`] as DotNetwork
	const chainConfig = chainConfigs.find((config) => config.genesisHash === network?.genesisHash)
	const result = nullToUndefined({
		...network,
		genesisHash: genesisHash as `0x${string}`,
		nativeToken: network ? tokens[network.nativeTokenId] : undefined,
		subscanUrl: network?.blockExplorerUrls.find(isSubscanUrl),
		...chainConfig,
	})
	return result as typeof result & { isDisabled?: boolean }
}

export type ChainInfo = ReturnType<typeof toChainInfo>

export const chain$ = (genesisHash: string): Observable<ChainInfo> =>
	getCachedQuery$("chain", genesisHash, () =>
		combineLatest([networksByGenesisHash$, tokensById$]).pipe(
			take(1),
			map(([networks, tokens]) => toChainInfo(genesisHash, networks, tokens))
		)
	)

export const [useChainOf] = bindSuspended(chain$)

export const useChain = () => useChainOf(useContext(ChainContext).genesisHash)

export const [useChainLoadableOf] = bind((genesisHash: string) => toLoadable(chain$(genesisHash)))

export const useChainLoadable = () => useChainLoadableOf(useContext(ChainContext).genesisHash)

export const enableTestnets$ = persistedState("EnableTestnets", z.boolean(), false, "session")

export const [useEnableTestnets] = bind(enableTestnets$)

export const setEnableTestnets = (enabled: boolean) => enableTestnets$.next(enabled)

const allChains$ = combineLatest(chainConfigs.map(({ genesisHash }) => chain$(genesisHash))).pipe(
	shareReplay({ bufferSize: 1, refCount: true })
)

const chains$ = combineLatest([allChains$, enableTestnets$]).pipe(
	map(([chains, enableTestnets]) =>
		enableTestnets ? chains : chains.filter((chain) => !chain.isTestnet)
	)
)

const hasNominationPools = (
	chain: ChainInfo
): chain is Extract<ChainInfo, { hasNominationPools: true }> =>
	"hasNominationPools" in chain && chain.hasNominationPools

const hasDappStaking = (chain: ChainInfo): chain is Extract<ChainInfo, { hasDappStaking: true }> =>
	"hasDappStaking" in chain && chain.hasDappStaking

const hasSubtensorStaking = (
	chain: ChainInfo
): chain is Extract<ChainInfo, { hasSubtensorStaking: true }> =>
	"hasSubtensorStaking" in chain && chain.hasSubtensorStaking

export const nominationPoolsEnabledChains$ = chains$.pipe(
	map((chains) => chains.filter(hasNominationPools))
)

export const dappStakingEnabledChains$ = chains$.pipe(
	map((chains) => chains.filter(hasDappStaking))
)

export const subtensorStakingEnabledChains$ = chains$.pipe(
	map((chains) => chains.filter(hasSubtensorStaking))
)

export const [useNominationPoolsEnabledChains] = bindSuspended(() => nominationPoolsEnabledChains$)

export const [useDappStakingEnabledChains] = bindSuspended(() => dappStakingEnabledChains$)

export const [useSubtensorStakingEnabledChains] = bindSuspended(
	() => subtensorStakingEnabledChains$
)

export const [useNominationPoolsEnabledChainsLoadable] = bind(
	toLoadable(nominationPoolsEnabledChains$)
)

export const [useDappStakingEnabledChainsLoadable] = bind(toLoadable(dappStakingEnabledChains$))

export const nativeTokenPrice$ = (genesisHash: string): Observable<number> =>
	chain$(genesisHash).pipe(
		switchMap((chain) =>
			chain.isTestnet || chain.nativeToken === undefined ? of(0) : tokenPrice$(chain.nativeToken.id)
		)
	)

export const [useNativeTokenPriceOf] = bindSuspended(nativeTokenPrice$)

export const useNativeTokenPrice = () => useNativeTokenPriceOf(useContext(ChainContext).genesisHash)

const GENESIS_SEPARATOR = ","

export const genesisHashesKey = (genesisHashes: string[]) => genesisHashes.join(GENESIS_SEPARATOR)

export const [useNativeTokenPrices] = bindSuspended((genesisHashes: string) =>
	genesisHashes === ""
		? of([] as number[])
		: combineLatest(
				genesisHashes.split(GENESIS_SEPARATOR).map((genesisHash) => nativeTokenPrice$(genesisHash))
			)
)

const decimalOf = (nativeToken: ChainInfo["nativeToken"]) => {
	const decimals = nativeToken?.decimals ?? 0
	const currency = nativeToken?.symbol
	return {
		decimals,
		fromPlanck: (value: string | number | bigint) =>
			Decimal.fromPlanck(value, decimals, { currency }),
		fromPlanckOrUndefined: (value: string | number | bigint | undefined, symbol?: string) =>
			Decimal.fromPlanckOrUndefined(value, decimals, { currency: symbol ?? currency }),
		fromUserInput: (input: string) => Decimal.fromUserInput(input, decimals, { currency }),
		fromUserInputOrUndefined: (input: string) =>
			Decimal.fromUserInputOrUndefined(input, decimals, { currency }),
	}
}

export type NativeTokenDecimal = ReturnType<typeof decimalOf>

export const nativeTokenDecimal$ = (genesisHash: string): Observable<NativeTokenDecimal> =>
	chain$(genesisHash).pipe(map((chain) => decimalOf(chain.nativeToken)))

export const [useNativeTokenDecimalOf] = bindSuspended(nativeTokenDecimal$)

export const useNativeTokenDecimal = () =>
	useNativeTokenDecimalOf(useContext(ChainContext).genesisHash)

export const nativeTokenAmountInputs$ = (genesisHash: string) =>
	combineLatest([
		nativeTokenDecimal$(genesisHash),
		nativeTokenPrice$(genesisHash),
		selectedCurrency$,
	])

export const [useNativeTokenAmountInputsOf] = bindSuspended(nativeTokenAmountInputs$)

export const useNativeTokenAmountInputs = () =>
	useNativeTokenAmountInputsOf(useContext(ChainContext).genesisHash)

const amountOf = (decimal: NativeTokenDecimal, price: number, currency: string) => {
	const fromValue =
		<T, T1 extends Decimal | undefined>(transformFn: (value: T, symbol?: string) => T1) =>
		(value: T, symbol?: string) => {
			const decimalAmount = transformFn(value, symbol)
			const fiatAmount = (decimalAmount?.toNumber() ?? 0) * price
			const localizedFiatAmount = fiatAmount.toLocaleString(undefined, {
				style: "currency",
				currency,
			})
			return { decimalAmount, fiatAmount, localizedFiatAmount }
		}
	return {
		fromPlanck: fromValue(decimal.fromPlanck),
		fromPlanckOrUndefined: fromValue(decimal.fromPlanckOrUndefined),
		fromUserInput: fromValue(decimal.fromUserInput),
		fromUserInputOrUndefined: fromValue(decimal.fromUserInputOrUndefined),
	}
}

export type NativeTokenAmount = ReturnType<typeof amountOf>

export const nativeTokenAmount$ = (genesisHash: string): Observable<NativeTokenAmount> =>
	nativeTokenAmountInputs$(genesisHash).pipe(
		map(([decimal, price, currency]) => amountOf(decimal, price, currency))
	)

export const [useNativeTokenAmountOf] = bindSuspended(nativeTokenAmount$)

export const useNativeTokenAmount = () =>
	useNativeTokenAmountOf(useContext(ChainContext).genesisHash)

export const [useNativeTokenAmountLoadableOf] = bind((genesisHash: string) =>
	toLoadable(nativeTokenAmount$(genesisHash))
)

export const useNativeTokenAmountLoadable = () =>
	useNativeTokenAmountLoadableOf(useContext(ChainContext).genesisHash)

const NO_AMOUNTS: Loadable<NativeTokenAmount>[] = []

export const [useNativeTokenAmountLoadables] = bind(
	(genesisHashes: string): Observable<Loadable<NativeTokenAmount>[]> =>
		genesisHashes === ""
			? of(NO_AMOUNTS)
			: combineLatest(
					genesisHashes
						.split(GENESIS_SEPARATOR)
						.map((genesisHash) => toLoadable(nativeTokenAmount$(genesisHash)))
				)
)
