import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePrevious } from "react-use"
import { AccountIcon } from "@/components/molecules/AccountIcon"
import { openWalletConnectionSideSheet } from "@/components/widgets/WalletConnectionSideSheet"
import type { SignerAccount } from "@/domains/accounts/accounts"
import { useBalances } from "@/domains/balances/balances"
import { useHasActiveWalletConnection } from "@/domains/extension/main"
import { Button } from "@/ui/atoms/Button"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"
import { Select } from "@/ui/molecules/Select"
import { encodeAnyAddress } from "@/util/addresses"
import { truncateAddress } from "@/util/truncateAddress"

export type AccountSelectorProps<T extends SignerAccount = SignerAccount> = {
	accounts: T[]
	prefix?: number
	selectedAccount?: T
	onChangeSelectedAccount: (account: T | undefined) => unknown
	inTransition?: boolean
	withBalance?: boolean
}

const optionKey = (account: SignerAccount) =>
	account.walletAccountId ?? encodeAnyAddress(account.address)

const AccountSelector = <T extends SignerAccount>({
	accounts,
	prefix = 42,
	selectedAccount,
	onChangeSelectedAccount,
	inTransition,
	withBalance,
}: AccountSelectorProps<T>) => {
	const hasActiveWalletConnection = useHasActiveWalletConnection()
	const balances = useBalances()
	const accountOf = useCallback(
		(key: string | undefined) => accounts.find((x) => optionKey(x) === key),
		[accounts]
	)
	const onChangeAccount = useCallback(
		(key: string | undefined) => onChangeSelectedAccount(accountOf(key)),
		[accountOf, onChangeSelectedAccount]
	)

	if (!hasActiveWalletConnection) {
		return (
			<Button onClick={openWalletConnectionSideSheet} css={{ width: "100%" }}>
				Connect wallet
			</Button>
		)
	}

	return (
		<Select
			className="w-full [&>button>div]:w-full [&>button]:!rounded-[8px] [&>button]:!py-[12px]"
			placeholder={<Select.Option headlineContent="Select an account" />}
			value={selectedAccount && optionKey(selectedAccount)}
			onChangeValue={onChangeAccount}
			renderSelected={
				inTransition
					? (key) => {
							const selectedAccount = accountOf(key)
							return (
								<Select.Option
									leadingIcon={<CircularProgressIndicator size="4rem" />}
									supportingContent={
										selectedAccount && selectedAccount.name
											? truncateAddress(encodeAnyAddress(selectedAccount.address, prefix))
											: ""
									}
									headlineContent={
										selectedAccount
											? (selectedAccount.name ??
												truncateAddress(encodeAnyAddress(selectedAccount.address, prefix)))
											: ""
									}
								/>
							)
						}
					: undefined
			}
		>
			{accounts.map((x) => (
				<Select.Option
					key={optionKey(x)}
					value={optionKey(x)}
					leadingIcon={<AccountIcon account={x} size="32px" />}
					className="!w-full [&>div]:w-full"
					headlineContent={
						<div className="flex w-full items-center justify-between">
							<div className="overflow-hidden">
								<p className="!mb-[4px] truncate font-semibold !leading-none">
									{x.name ?? truncateAddress(encodeAnyAddress(x.address, prefix))}
								</p>
								{x.name || x.walletName ? (
									<p className="truncate !text-[12px] !leading-none !text-gray-300 brightness-100">
										{[x.walletName, x.name && truncateAddress(encodeAnyAddress(x.address, prefix))]
											.filter(Boolean)
											.join(" · ")}
									</p>
								) : null}
							</div>

							{withBalance ? (
								<p className="text-[14px] text-gray-400">
									$
									{balances
										.find((q) => encodeAnyAddress(q.address) === encodeAnyAddress(x.address))
										.sum.fiat("usd")
										.transferable.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
								</p>
							) : null}
						</div>
					}
				/>
			))}
		</Select>
	)
}

export const useAccountSelector = <T extends SignerAccount>(
	accounts: T[],
	initialAccount?: T | number | ((accounts?: T[]) => T | undefined),
	accountSelectorProps?: Omit<
		AccountSelectorProps<T>,
		"accounts" | "selectedAccount" | "onChangeSelectedAccount"
	>,
	withToken?: boolean
) => {
	// TODO: remove this
	const [inTransition] = useTransition()

	const getInitialAccount = useCallback(
		(accounts: T[]) =>
			typeof initialAccount === "function"
				? initialAccount(accounts)
				: typeof initialAccount === "number"
					? accounts.at(initialAccount)
					: initialAccount,
		[initialAccount]
	)

	const [account, setAccount] = useState<T | undefined>(getInitialAccount(accounts))

	const previousAccounts = usePrevious(accounts)
	const accountsUpdated = useMemo(
		() => JSON.stringify(previousAccounts) !== JSON.stringify(accounts),
		[accounts, previousAccounts]
	)

	useEffect(() => {
		if (accountsUpdated || (account === undefined && accounts.length > 0)) {
			setAccount(getInitialAccount(accounts))
		}
	}, [account, accounts, accountsUpdated, getInitialAccount])

	const selectedAccount = account
		? accounts.find((x) => optionKey(x) === optionKey(account))
		: undefined

	return [
		[selectedAccount, setAccount] as const,
		<AccountSelector
			{...accountSelectorProps}
			accounts={accounts}
			selectedAccount={account}
			onChangeSelectedAccount={setAccount}
			inTransition={inTransition}
			withBalance={withToken}
		/>,
		inTransition,
	] as const
}
