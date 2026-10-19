import { bind } from "@react-rxjs/core"
import { uniqBy } from "lodash"
import {
	BehaviorSubject,
	combineLatest,
	ignoreElements,
	map,
	merge,
	type Observable,
	shareReplay,
} from "rxjs"
import { isAddress as isEvmAddress } from "viem"
import { z } from "zod"
import { signetAccount$ } from "@/domains/extension/signet"
import {
	type InjectedSubstrateAccount,
	injectedSubstrateAccounts$,
	type WalletAccountRef,
	walletAccounts$,
} from "@/domains/extension/substrate"
import { tryParseSubstrateOrEthereumAddress } from "@/util/addressValidation"
import { persistedState } from "@/util/persistedState"

type AccountWithOrigin = InjectedSubstrateAccount & { origin?: "injected" | "local" }

export type Account = AccountWithOrigin & { canSignEvm?: boolean }

export type SignerAccount = Account & Partial<WalletAccountRef>

export type ReadonlyAccount = Pick<Account, "address" | "name">

export const lookupAddressSearchKey = "lookup-address"

const shared = <T>(source$: Observable<T>) =>
	source$.pipe(shareReplay({ bufferSize: 1, refCount: true }))

export const lookupAccountAddress$ = new BehaviorSubject<string | undefined>(
	new URLSearchParams(globalThis.location?.search).get(lookupAddressSearchKey) ?? undefined
)

export const setLookupAccountAddress = (address: string | undefined) =>
	lookupAccountAddress$.next(address)

const pageLoadLookupAccountAddress = lookupAccountAddress$.value

export const resetLookupAccountAddress = () =>
	lookupAccountAddress$.next(pageLoadLookupAccountAddress)

const isDefined = <T>(value: T | undefined): value is T => value !== undefined

const addressType = (address: string) => (isEvmAddress(address) ? ("ethereum" as const) : undefined)

const lookupAccounts$: Observable<Account[]> = shared(
	lookupAccountAddress$.pipe(
		map((lookup) =>
			(lookup ?? "")
				.split(",")
				.map((address) => address.trim())
				.filter((address) => address !== "")
				.map((address) => tryParseSubstrateOrEthereumAddress(address))
				.filter(isDefined)
				.map((address) => ({
					address,
					readonly: true,
					partOfPortfolio: false,
					type: addressType(address),
				}))
		)
	)
)

const readonlyAccountSchema = z.object({ address: z.string(), name: z.string().optional() })

export const storedReadonlyAccounts$ = persistedState(
	"readonly_accounts",
	z.array(readonlyAccountSchema),
	[]
)

export const setStoredReadonlyAccounts = (accounts: ReadonlyAccount[]) =>
	storedReadonlyAccounts$.next(
		accounts.map(({ address, name }) => (name === undefined ? { address } : { address, name }))
	)

export const injectedAccounts$: Observable<Account[]> = shared(
	injectedSubstrateAccounts$.pipe(
		map((accounts) => accounts.map((account) => ({ ...account, origin: "injected" as const })))
	)
)

export const readonlyAccounts$: Observable<Account[]> = shared(
	combineLatest([injectedAccounts$, storedReadonlyAccounts$]).pipe(
		map(([injected, stored]) => {
			const injectedAddresses = injected.map((account) => account.address)
			return [
				...injected.filter((account) => account.readonly && !account.partOfPortfolio),
				...stored
					.filter((account) => !injectedAddresses.includes(account.address))
					.map((account) => ({
						...account,
						origin: "local" as const,
						readonly: true,
						partOfPortfolio: false,
						type: addressType(account.address),
					})),
			]
		})
	)
)

const wagmiAccounts$ = new BehaviorSubject<Account[]>([])

export const setWagmiAccounts = (addresses: readonly string[]) =>
	wagmiAccounts$.next(addresses.map((address) => ({ address, type: "ethereum", canSignEvm: true })))

export const ownAccounts$: Observable<Account[]> = shared(
	combineLatest([signetAccount$, injectedAccounts$, wagmiAccounts$, readonlyAccounts$]).pipe(
		map(([signetAccount, injected, wagmi, readonly]) => {
			if (signetAccount !== undefined)
				return [{ ...signetAccount, readonly: false, partOfPortfolio: true }]
			const named = wagmi.map((account) => ({
				...account,
				name: injected.find((candidate) => candidate.address === account.address)?.name,
			}))
			return uniqBy([...named, ...injected, ...readonly], (account) => account.address)
		})
	)
)

export const ownPortfolioAccounts$ = shared(
	ownAccounts$.pipe(
		map((accounts) => accounts.filter((account) => !account.readonly || account.partOfPortfolio))
	)
)

export const accounts$: Observable<Account[]> = shared(
	combineLatest([signetAccount$, ownAccounts$, lookupAccounts$]).pipe(
		map(([signetAccount, own, lookup]) =>
			signetAccount !== undefined ? own : uniqBy([...own, ...lookup], (account) => account.address)
		)
	)
)

const isWriteable = (account: Account) => !account.readonly
const isSubstrate = (account: Account) => account.type !== "ethereum"
const isEvm = (account: Account) => account.type === "ethereum"

export const portfolioAccounts$ = shared(
	accounts$.pipe(
		map((accounts) => accounts.filter((account) => !account.readonly || account.partOfPortfolio))
	)
)

export const writeableAccounts$ = shared(
	accounts$.pipe(map((accounts) => accounts.filter(isWriteable)))
)

export const writeableSubstrateAccounts$: Observable<SignerAccount[]> = shared(
	combineLatest([writeableAccounts$, walletAccounts$]).pipe(
		map(([accounts, walletAccounts]) =>
			accounts.filter(isSubstrate).flatMap((account): SignerAccount[] => {
				const held = walletAccounts.filter(({ address }) => address === account.address)
				return held.length > 0
					? held.map((walletAccount) => ({ ...account, ...walletAccount }))
					: [account]
			})
		)
	)
)

export const writeableEvmAccounts$ = shared(
	writeableAccounts$.pipe(map((accounts) => accounts.filter(isEvm)))
)

export const selectedAccountAddresses$ = new BehaviorSubject<string[] | undefined>(undefined)

export const setSelectedAccountAddresses = (addresses: string[]) =>
	selectedAccountAddresses$.next(addresses)

export const resetSelectedAccountAddresses = () => selectedAccountAddresses$.next(undefined)

export const selectedAccounts$: Observable<Account[]> = shared(
	combineLatest([
		signetAccount$,
		accounts$,
		portfolioAccounts$,
		readonlyAccounts$,
		selectedAccountAddresses$,
		lookupAccounts$,
	]).pipe(
		map(([signetAccount, accounts, portfolio, readonly, selectedAddresses, lookup]) => {
			if (signetAccount !== undefined) return [signetAccount]
			if (lookup.length > 0) return lookup
			const onlyHasReadonlyAccounts = portfolio.length === 0 && readonly.length > 0
			const defaultDisplayed = onlyHasReadonlyAccounts ? readonly.slice(0, 1) : portfolio
			if (selectedAddresses === undefined) return defaultDisplayed
			const selected = accounts.filter(({ address }) => selectedAddresses.includes(address))
			return selected.length === 0 ? defaultDisplayed : selected
		})
	)
)

export const selectedSubstrateAccounts$ = shared(
	selectedAccounts$.pipe(map((accounts) => accounts.filter(isSubstrate)))
)

export const selectedEvmAccounts$ = shared(
	selectedAccounts$.pipe(map((accounts) => accounts.filter(isEvm)))
)

const retainedAccountLists: Observable<Account[]>[] = []

const bindRetained = <T extends Account>(list$: Observable<T[]>) => {
	const noAccounts: T[] = []
	const [useList, listState$] = bind(list$, noAccounts)
	retainedAccountLists.push(listState$)
	return useList
}

export const useInjectedAccounts = bindRetained(injectedAccounts$)
export const useReadonlyAccounts = bindRetained(readonlyAccounts$)
export const useOwnAccounts = bindRetained(ownAccounts$)
export const useOwnPortfolioAccounts = bindRetained(ownPortfolioAccounts$)
export const useAccounts = bindRetained(accounts$)
export const usePortfolioAccounts = bindRetained(portfolioAccounts$)
export const useWriteableAccounts = bindRetained(writeableAccounts$)
export const useWriteableSubstrateAccounts = bindRetained(writeableSubstrateAccounts$)
export const useWriteableEvmAccounts = bindRetained(writeableEvmAccounts$)
export const useSelectedAccounts = bindRetained(selectedAccounts$)
export const useSelectedSubstrateAccounts = bindRetained(selectedSubstrateAccounts$)
export const useSelectedEvmAccounts = bindRetained(selectedEvmAccounts$)
export const [useLookupAccountAddress] = bind(lookupAccountAddress$)
export const [useSelectedAccountAddresses] = bind(selectedAccountAddresses$)

export const accountListsRetained$: Observable<never> = merge(...retainedAccountLists).pipe(
	ignoreElements()
)
