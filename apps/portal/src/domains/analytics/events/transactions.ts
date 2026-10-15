import { evmChains } from "@/domains/extension/evmChains"
import type { EventGroup } from "../events"
import { optional, p, parseEnum } from "../properties"

const SUBSTRATE_CHAINS = [
	"analog-timechain",
	"polkadot-asset-hub",
	"kusama-asset-hub",
	"astar",
	"vara",
	"avail",
	"cere",
	"bittensor",
	"westend-testnet",
	"shibuya-testnet",
	"other",
] as const

export const substrateChainOf = parseEnum(SUBSTRATE_CHAINS, "other")

const PALLETS = [
	"balances",
	"dappStaking",
	"fastUnstake",
	"nominationPools",
	"staking",
	"subtensorModule",
	"system",
	"utility",
	"other",
] as const

export const palletOf = parseEnum(PALLETS, "other")

const CALLS = [
	"addStake",
	"addStakeLimit",
	"batchAll",
	"bondExtra",
	"chill",
	"claimBonusReward",
	"claimPayout",
	"claimStakerRewards",
	"cleanupExpiredEntries",
	"join",
	"lock",
	"moveStake",
	"registerFastUnstake",
	"remarkWithEvent",
	"removeStake",
	"removeStakeLimit",
	"setClaimPermission",
	"stake",
	"transferKeepAlive",
	"unbond",
	"unlock",
	"unstake",
	"withdrawUnbonded",
	"other",
] as const

export const callOf = parseEnum(CALLS, "other")

const EVM_CHAINS = [...evmChains.map(({ name }) => name), "other"] as const

export const evmChainOf = (chainId: number | undefined) =>
	evmChains.find(({ id }) => id === chainId)?.name ?? "other"

const CONTRACT_FUNCTIONS = [
	"approve",
	"stake",
	"getReward",
	"requestWithdrawal",
	"cancelWithdrawal",
	"completeWithdrawal",
	"increment",
	"other",
] as const

export const contractFunctionOf = parseEnum(CONTRACT_FUNCTIONS, "other")

export const transactionEvents = {
	"Extrinsic in block": {
		description:
			"A Substrate transaction the portal built reached a block without a dispatch error, once for the call and once for each call of a batch",
		properties: {
			chain: p.enum(SUBSTRATE_CHAINS, "Chain, or other for a chain the portal does not stake on"),
			module: p.enum(PALLETS, "Pallet of the call, or other for an unlisted one"),
			section: p.enum(CALLS, "Call within the pallet, or other for an unlisted one"),
			parent_module: optional(p.enum(PALLETS, "Pallet of the batch that holds the call")),
			parent_section: optional(p.enum(CALLS, "Call of the batch that holds the call")),
		},
	},
	"Write to EVM contract": {
		description: "An Ethereum contract call the portal built was submitted",
		properties: {
			chain: p.enum(EVM_CHAINS, "Chain, or other for a chain the portal does not list"),
			functionName: p.enum(CONTRACT_FUNCTIONS, "Contract function, or other for an unlisted one"),
		},
	},
} as const satisfies EventGroup
