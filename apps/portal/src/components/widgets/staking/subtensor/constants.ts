import type { BondOption } from "@/domains/staking/subtensor/types"

export const ROOT_NETUID = 0
export const MIN_SUBTENSOR_ALPHA_STAKE = 0.001
export const MIN_SUBTENSOR_ROOTNET_STAKE = 0.1
export const TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR =
	"5FjP1T2Rn8Ymr3fynVqZEjhqR4wfbB6owY6Z2fgfkVngZYYE"
export const TALISMAN_FEE_BITTENSOR = 0.3
export const TALISMAN_STAKE_REMARK = "paprika005"
export const TALISMAN_WALLET_DOWNLOAD_URL = "https://talisman.xyz/download"

export const DTAO_SYMBOL = "Dynamic TAO"
export const DTAO_LOGO =
	"https://raw.githubusercontent.com/TalismanSociety/talisman-web/8c5d78676702214c6983b04c9f15c15f34d34109/packages/icons/src/svgs/dtaoLogo.svg"

// Placeholder for a default validator for dTAO. The correct default validator for a given Subnet is picked when the user picks a subnet.
export const DEFAULT_VALIDATOR = {
	name: "Yuma, a DCG Company",
	poolId: "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1",
} as BondOption
