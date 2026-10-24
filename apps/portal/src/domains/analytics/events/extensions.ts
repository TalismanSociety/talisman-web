import type { EventGroup } from "../events"
import { p, parseEnum } from "../properties"

const SUBSTRATE_WALLETS = [
	"talisman",
	"polkadot-js",
	"subwallet-js",
	"enkrypt",
	"fearless-wallet",
	"polkagate",
	"other",
] as const

export const substrateWalletOf = parseEnum(SUBSTRATE_WALLETS, "other")

const EVM_WALLETS = [
	"injected",
	"xyz.talisman",
	"io.metamask",
	"app.subwallet",
	"io.rabby",
	"com.coinbase.wallet",
	"com.brave.wallet",
	"com.okex.wallet",
	"walletConnect",
	"other",
] as const

export const evmWalletOf = parseEnum(EVM_WALLETS, "other")

export const extensionEvents = {
	"EVM extensions connected": {
		description: "The portal holds one or more Ethereum wallet connections",
		properties: {
			wallet: p.enum(
				EVM_WALLETS,
				"Wallet of the newest connection, by its EIP-6963 id, or other for an unlisted one"
			),
			connections: p.count("Number of Ethereum wallet connections"),
		},
	},
	"Substrate extensions connected": {
		description: "The portal connected a Polkadot wallet extension",
		properties: {
			wallet: p.enum(SUBSTRATE_WALLETS, "Wallet extension, or other for an unlisted one"),
		},
	},
} as const satisfies EventGroup
