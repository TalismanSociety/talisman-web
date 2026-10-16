import {
	arbitrum,
	blast,
	bsc,
	mainnet,
	manta,
	moonbeam,
	moonriver,
	optimism,
	polygon,
} from "wagmi/chains"

export const evmChains = [
	bsc,
	mainnet,
	moonbeam,
	moonriver,
	arbitrum,
	polygon,
	optimism,
	blast,
	manta,
] as const
