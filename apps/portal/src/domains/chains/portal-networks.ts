import { evmErc20TokenId, type NetworkId, type TokenId } from "@talismn/chaindata-provider"

import { lidoMainnet } from "../staking/lido/config.ts"

export type PortalNetwork = {
	rpc?: string
	tokens?: TokenId[]
	networkLogoForNativeToken?: true
}

export const PORTAL_NETWORKS = {
	"polkadot-asset-hub": { rpc: "wss://polkadot-asset-hub-rpc.polkadot.io" },
	"kusama-asset-hub": { rpc: "wss://kusama-asset-hub-rpc.polkadot.io" },
	polkadot: { rpc: "wss://rpc.polkadot.io" },
	kusama: { rpc: "wss://kusama-rpc.polkadot.io" },
	"analog-timechain": {},
	vara: { networkLogoForNativeToken: true },
	avail: { rpc: "wss://mainnet-rpc.avail.so/ws", networkLogoForNativeToken: true },
	cere: { networkLogoForNativeToken: true },
	bittensor: { rpc: "wss://entrypoint-finney.opentensor.ai:443", networkLogoForNativeToken: true },
	astar: { networkLogoForNativeToken: true },
	"westend-testnet": {},
	"1": { tokens: [evmErc20TokenId("1", lidoMainnet.token.address)] },
} satisfies Record<NetworkId, PortalNetwork>
