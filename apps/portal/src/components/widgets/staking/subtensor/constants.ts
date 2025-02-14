import { SubnetPool } from '@/domains/staking/subtensor/types'

export const ROOT_NETUID = 0
// TODO: Update Fee Receiver Address
export const TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR = '5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP'
export const TALISMAN_FEE_BITTENSOR = 0.5

export const DTAO_SYMBOL = 'Dynamic TAO'

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
