import { useEffect } from "react"
import { useConfig, useConnect, useConnection, useConnections, useConnectors } from "wagmi"
import { setWagmiAccounts } from "@/domains/accounts/accounts"
import { track } from "@/domains/analytics/client"
import { evmWalletOf } from "@/domains/analytics/events/extensions"
import { toast } from "@/ui/molecules/Toaster"
import { mirrorWalletConnectSession, walletConnectConnectorId } from "./walletconnect-evm"

const hiddenConnectorIds = new Set(["injected", walletConnectConnectorId])

export const useEvmConnectors = () =>
	useConnectors().filter((connector) => !hiddenConnectorIds.has(connector.id))

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
	const config = useConfig()

	useEffect(() => mirrorWalletConnectSession(config), [config])

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
