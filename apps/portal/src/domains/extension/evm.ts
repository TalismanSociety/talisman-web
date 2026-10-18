import { useEffect } from "react"
import { useConnect, useConnection, useConnections, useConnectors } from "wagmi"
import { setWagmiAccounts } from "@/domains/accounts/accounts"
import { track } from "@/domains/analytics/client"
import { evmWalletOf } from "@/domains/analytics/events/extensions"
import { toast } from "@/ui/molecules/Toaster"

export const useEvmConnectors = () =>
	useConnectors().filter((connector) => connector.id !== "injected")

export const useConnectEvm = () => {
	const base = useConnect()

	useEffect(() => {
		if (base.error !== null) {
			toast.error("Wallet connection declined")
		}
	}, [base.error])

	return base
}

export const useEvmExtensionEffect = () => {
	const connections = useConnections()

	useEffect(() => {
		const newest = connections.at(-1)
		if (newest) {
			track("EVM extensions connected", {
				wallet: evmWalletOf(newest.connector.id),
				connections: connections.length,
			})
		}
	}, [connections])

	const { addresses } = useConnection()

	useEffect(() => {
		setWagmiAccounts(addresses ?? [])
	}, [addresses])
}
