import { SubnetPool } from '@/domains/staking/subtensor/types'

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

export const DEFAULT_SUBNET: SubnetPool = {
  alpha_in_pool: '',
  alpha_staked: '',
  block_number: 0,
  liquidity: '',
  market_cap: '',
  name: '𝜏',
  netuid: 0,
  price: '',
  price_change_1_day: '',
  price_change_1_hour: '',
  price_change_1_week: '',
  seven_day_prices: [],
  symbol: 'Τ',
  tao_volume_24_hr: '',
  timestamp: '',
  total_alpha: '',
  total_tao: '',
  tao_buy_volume_24_hr: '',
  tao_sell_volume_24_hr: '',
  buys_24_hr: 0,
  sells_24_hr: 0,
  buyers_24_hr: 0,
  sellers_24_hr: 0,
}
