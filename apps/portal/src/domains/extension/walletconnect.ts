import { walletConnect } from "@kheopskit/core/walletconnect"
import type { CaipNetwork, CreateAppKit } from "@reown/appkit/core"
import type { Chain } from "viem"
import { evmChains } from "./evmChains"

export const appName = import.meta.env.VITE_APPLICATION_NAME ?? "Talisman"

const origin = globalThis.location?.origin ?? "https://app.talisman.xyz"

type WalletConnectNetwork = {
	name: string
	genesisHash: `0x${string}`
	symbol: string
	decimals: number
	rpc: `https://${string}`
}

export const walletConnectNetworks = [
	{
		name: "Polkadot Asset Hub",
		genesisHash: "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f",
		symbol: "DOT",
		decimals: 10,
		rpc: "https://polkadot-asset-hub-rpc.polkadot.io",
	},
	{
		name: "Kusama Asset Hub",
		genesisHash: "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a",
		symbol: "KSM",
		decimals: 12,
		rpc: "https://kusama-asset-hub-rpc.polkadot.io",
	},
	{
		name: "Polkadot",
		genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
		symbol: "DOT",
		decimals: 10,
		rpc: "https://rpc.polkadot.io",
	},
	{
		name: "Kusama",
		genesisHash: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
		symbol: "KSM",
		decimals: 12,
		rpc: "https://kusama-rpc.polkadot.io",
	},
	{
		name: "Astar",
		genesisHash: "0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6",
		symbol: "ASTR",
		decimals: 18,
		rpc: "https://rpc.astar.network",
	},
	{
		name: "Vara",
		genesisHash: "0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763",
		symbol: "VARA",
		decimals: 12,
		rpc: "https://rpc.vara.network",
	},
	{
		name: "Bittensor",
		genesisHash: "0x2f0555cc76fc2840a25a6ea3b9637146806f1f44b090c175ffde2a7e5ab36c03",
		symbol: "TAO",
		decimals: 9,
		rpc: "https://entrypoint-finney.opentensor.ai",
	},
] as const satisfies readonly [WalletConnectNetwork, ...WalletConnectNetwork[]]

const toPolkadotNetwork = ({
	name,
	genesisHash,
	symbol,
	decimals,
	rpc,
}: WalletConnectNetwork): CaipNetwork => {
	const id = genesisHash.slice(2, 34)
	return {
		id,
		name,
		nativeCurrency: { name: symbol, symbol, decimals },
		rpcUrls: { default: { http: [rpc] } },
		chainNamespace: "polkadot",
		caipNetworkId: `polkadot:${id}`,
	}
}

export const toEvmWalletConnectNetwork = (chain: Chain): CaipNetwork => ({
	...chain,
	chainNamespace: "eip155",
	caipNetworkId: `eip155:${chain.id}`,
})

const [primaryNetwork, ...otherNetworks] = walletConnectNetworks

export const portalWalletConnect = walletConnect({
	projectId: "bf8b7e7ceb10eb8c769504ea0b547565",
	metadata: {
		name: appName,
		description: "Talisman Portal",
		url: origin,
		icons: [`${origin}/apple-touch-icon.png`],
	},
	networks: [
		toPolkadotNetwork(primaryNetwork),
		...otherNetworks.map(toPolkadotNetwork),
		...evmChains.map(toEvmWalletConnectNetwork),
	],
	themeMode: "dark",
	themeVariables: {
		"--w3m-accent": "rgb(213,255,92)",
		"--w3m-font-family": "'Surt', sans-serif",
		"--w3m-z-index": 1000,
	},
	appKitOptions: {
		features: {
			analytics: false,
			email: false,
			socials: false,
			swaps: false,
			onramp: false,
		} satisfies CreateAppKit["features"],
	},
})
