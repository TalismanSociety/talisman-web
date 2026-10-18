import { useConnection } from "wagmi"
import { openWalletConnectionSideSheet } from "@/components/widgets/WalletConnectionSideSheet"
import { useInjectedAccounts, useWriteableAccounts } from "@/domains/accounts/accounts"
import { useConnectedSubstrateWallet } from "@/domains/extension/substrate"
import { ChevronDown, Ethereum, Polkadot } from "@/icons"
import { Clickable } from "@/ui/atoms/Clickable"
import { cn } from "@/util/cn"

export const WalletConnectionButton = () => {
	const hasSubWallet = useConnectedSubstrateWallet() !== undefined
	const hasSubAccounts = useInjectedAccounts().length !== 0
	const subConnected = hasSubWallet && hasSubAccounts
	const evmConnected = useConnection().isConnected

	const hasActiveConnection = subConnected || evmConnected
	const accounts = useWriteableAccounts()

	return (
		<Clickable.WithFeedback>
			<div
				className={cn(
					"flex h-12 select-none items-center justify-center gap-2 rounded-full border border-gray-600 bg-gray-950 p-4 text-white"
				)}
				onClick={openWalletConnectionSideSheet}
			>
				<div
					className={cn("flex w-0  items-center justify-center", hasActiveConnection && "w-[2rem]")}
				>
					{subConnected && <Polkadot className="shrink-0 text-sm text-[#e6007a]" size="1em" />}
					{evmConnected && <Ethereum className="shrink-0 text-sm text-[#62688f]" size="1em" />}
				</div>

				<div className="whitespace-pre text-xl leading-none">
					{hasActiveConnection ? (
						<div className="flex items-center gap-1">
							<span>{accounts.length}</span>
							<span>Connected</span>
						</div>
					) : (
						<div>Connect wallet</div>
					)}
				</div>

				<ChevronDown size="1em" />
			</div>
		</Clickable.WithFeedback>
	)
}
