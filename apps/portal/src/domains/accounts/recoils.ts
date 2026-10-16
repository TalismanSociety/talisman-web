import { selector } from "recoil"
import { atomFromObservable, atomFromSubject } from "@/domains/common/recoil-bridge"
import { signetAccount$ } from "@/domains/extension/signet"

import {
	type Account,
	accounts$,
	injectedAccounts$,
	lookupAccountAddress$,
	ownAccounts$,
	ownPortfolioAccounts$,
	portfolioAccounts$,
	type ReadonlyAccount,
	readonlyAccounts$,
	selectedAccountAddresses$,
	selectedAccounts$,
	selectedEvmAccounts$,
	selectedSubstrateAccounts$,
	setStoredReadonlyAccounts,
	writeableAccounts$,
	writeableEvmAccounts$,
	writeableSubstrateAccounts$,
} from "./accounts"

export type { Account, ReadonlyAccount } from "./accounts"
export { lookupAddressSearchKey } from "./accounts"

const NO_ACCOUNTS: Account[] = []

export const lookupAccountAddressState = atomFromSubject(
	"LookupAccountAddress",
	lookupAccountAddress$
)

export const substrateInjectedAccountsState = atomFromObservable(
	"SubstrateInjectedAccounts",
	injectedAccounts$,
	NO_ACCOUNTS
)

const readonlyAccountsAtom = atomFromObservable(
	"ReadonlyAccountsBridge",
	readonlyAccounts$,
	NO_ACCOUNTS
)

export const readOnlyAccountsState = selector<Account[]>({
	key: "ReadonlyAccounts",
	get: ({ get }) => get(readonlyAccountsAtom),
	set: (_, accounts) => setStoredReadonlyAccounts(accounts as ReadonlyAccount[]),
})

export const ownAccountsState = atomFromObservable("OwnAccounts", ownAccounts$, NO_ACCOUNTS)

export const ownPortfolioAccountsState = atomFromObservable(
	"OwnPortfolioAccounts",
	ownPortfolioAccounts$,
	NO_ACCOUNTS
)

export const accountsState = atomFromObservable("Accounts", accounts$, NO_ACCOUNTS)

export const portfolioAccountsState = atomFromObservable(
	"PortfolioAccounts",
	portfolioAccounts$,
	NO_ACCOUNTS
)

export const writeableAccountsState = atomFromObservable(
	"WriteableAccounts",
	writeableAccounts$,
	NO_ACCOUNTS
)

export const writeableSubstrateAccountsState = atomFromObservable(
	"WriteableSubstrateAccounts",
	writeableSubstrateAccounts$,
	NO_ACCOUNTS
)

export const writeableEvmAccountsState = atomFromObservable(
	"WriteableEvmAccounts",
	writeableEvmAccounts$,
	NO_ACCOUNTS
)

export const evmSignableAccountsState = atomFromObservable(
	"EvmSignableAccounts",
	writeableEvmAccounts$,
	NO_ACCOUNTS
)

export const selectedAccountAddressesState = atomFromSubject(
	"SelectedAccountAddresses",
	selectedAccountAddresses$
)

export const selectedAccountsState = atomFromObservable(
	"SelectedAccounts",
	selectedAccounts$,
	NO_ACCOUNTS
)

export const selectedSubstrateAccountsState = atomFromObservable(
	"SelectedSubstrateAccounts",
	selectedSubstrateAccounts$,
	NO_ACCOUNTS
)

export const selectedEvmAccountsState = atomFromObservable(
	"SelectedEvmAccountsState",
	selectedEvmAccounts$,
	NO_ACCOUNTS
)

export const signetAccountState = atomFromObservable("SignetAccount", signetAccount$, undefined)
