import { BondOption } from '@/domains/staking/subtensor/types'

export const ROOT_NETUID = 0
export const MIN_SUBTENSOR_ALPHA_STAKE = 0.001
export const MIN_SUBTENSOR_ROOTNET_STAKE = 0.1
export const TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR = '5DzsVV2L4M9r4uWoyarzPyhfeCv6DDAEs5rM2bpHjmerPcGa'
export const TALISMAN_FEE_BITTENSOR = 0.3
export const TAO_STAKE_GENESIS_MONTH_TIMESTAMP = 1677628800 // Wednesday, March 1, 2023 7:00:00 AM GMT+07:00
export const TAO_DECIMALS = 9n
export const SCALE_FACTOR = 10n ** TAO_DECIMALS // Equivalent to 10e9 for precision

export const DTAO_SYMBOL = 'Dynamic TAO'
export const DTAO_LOGO =
  'https://raw.githubusercontent.com/TalismanSociety/talisman-web/8c5d78676702214c6983b04c9f15c15f34d34109/packages/icons/src/svgs/dtaoLogo.svg'

// Placeholder for a default validator for dTAO. The correct default validator for a given Subnet is picked when the user picks a subnet.
export const DEFAULT_VALIDATOR = {
  name: 'RoundTable21',
  poolId: '5FtBncJvGhxjBs4aFn2pid6aur9tBUuo9QR7sHe5DkoRizzo',
} as BondOption
