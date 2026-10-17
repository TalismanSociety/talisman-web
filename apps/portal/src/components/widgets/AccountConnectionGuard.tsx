import type { ReactNode } from "react"
import { useState } from "react"

import { Welcome } from "@/components/recipes/Welcome"
import {
	setLookupAccountAddress,
	useLookupAccountAddress,
	useReadonlyAccounts,
} from "@/domains/accounts/accounts"
import { popularAccounts } from "@/domains/accounts/consts"
import { useHasActiveWalletConnection } from "@/domains/extension/main"
import { useInitialisedSubstrateWallets } from "@/domains/extension/substrate"
import { truncateAddress } from "@/util/truncateAddress"

import { openWalletConnectionSideSheet } from "./WalletConnectionSideSheet"

export type AccountConnectionGuardProps = { children?: ReactNode; noSuspense?: boolean }

const useShouldShowAccountConnectionGuard = () => {
	const hasActiveWalletConnection = useHasActiveWalletConnection()
	const readonlyAccounts = useReadonlyAccounts()
	const lookupAccount = useLookupAccountAddress()

	return !hasActiveWalletConnection && readonlyAccounts.length === 0 && lookupAccount === undefined
}

export const AccountConnectionGuard = ({ children, noSuspense }: AccountConnectionGuardProps) => {
	const shouldShowGuard = useShouldShowAccountConnectionGuard()
	const [addressInput, setAddressInput] = useState("")
	const walletConnectionInitialised = useInitialisedSubstrateWallets()
	// triggers parent <Suspense />
	if (!walletConnectionInitialised && !noSuspense) throw new Promise<void>((resolve) => resolve())

	if (!shouldShowGuard) return children

	return (
		<div css={{ display: "flex", width: "100%", height: "100%", alignItems: "center" }}>
			<Welcome
				walletButton={<Welcome.WalletButton onClick={openWalletConnectionSideSheet} />}
				addressInput={<Welcome.AddressInput value={addressInput} onChangeText={setAddressInput} />}
				addressInputConfirmButton={
					<Welcome.AddressInputConfirmButton
						onClick={() => setLookupAccountAddress(addressInput)}
					/>
				}
				popularAccounts={popularAccounts.map((x, index) => (
					<Welcome.PopularAccount
						key={index}
						name={x.name ?? truncateAddress(x.address)}
						address={x.address}
						description={x.description}
						onClick={() => setLookupAccountAddress(x.address)}
					/>
				))}
				css={{ flex: 1, margin: "auto" }}
			/>
		</div>
	)
}
