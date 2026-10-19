import type { WalletAccountId } from "@kheopskit/core"
import { bind } from "@react-rxjs/core"
import { BehaviorSubject } from "rxjs"
import { signableWalletAccountsOf, type WalletAccount, waitForSigningAccount } from "./substrate"

export type Signer = { address: string; walletAccountId?: WalletAccountId }

export type WalletChoice = {
	options: WalletAccount[]
	choose: (option: WalletAccount | undefined) => void
}

const walletChoiceSubject$ = new BehaviorSubject<WalletChoice | undefined>(undefined)

export const [useWalletChoice, walletChoice$] = bind(walletChoiceSubject$)

const askWhichWallet = (options: WalletAccount[]) =>
	new Promise<WalletAccount | undefined>((resolve) => {
		walletChoiceSubject$.value?.choose(undefined)
		const choice: WalletChoice = {
			options,
			choose: (option) => {
				if (walletChoiceSubject$.value === choice) walletChoiceSubject$.next(undefined)
				resolve(option)
			},
		}
		walletChoiceSubject$.next(choice)
	})

const walletAccountIdFor = async ({ address, walletAccountId }: Signer) => {
	if (walletAccountId) return walletAccountId
	const options = await signableWalletAccountsOf(address)
	if (options.length < 2) return options[0]?.walletAccountId
	const chosen = await askWhichWallet(options)
	if (!chosen) throw new Error("Cancelled")
	return chosen.walletAccountId
}

export const signingAccountFor = async (signer: Signer) => {
	const walletAccountId = await walletAccountIdFor(signer)
	return walletAccountId ? await waitForSigningAccount(walletAccountId) : undefined
}
