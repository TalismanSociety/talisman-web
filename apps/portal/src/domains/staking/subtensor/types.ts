type Pagination = {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
  next_page: number | null
  prev_page: number | null
}

// Key Type
type Key = {
  ss58: string
  hex: string
}

// Subnet Dominance Type
type SubnetDominance = {
  netuid: number
  dominance: string
  family_stake: string
}

// Validator Data Type
type ValidatorData = {
  hotkey: Key
  coldkey: Key
  name: string
  block_number: number
  timestamp: string // ISO date format string
  rank: number
  nominators: number
  nominators_24_hr_change: number
  system_stake: string
  stake: string
  stake_24_hr_change: string
  dominance: string
  validator_stake: string
  take: string
  total_daily_return: string
  validator_return: string
  nominator_return_per_k: string
  apr: string
  nominator_return_per_k_7_day_average: string
  nominator_return_per_k_30_day_average: string
  apr_7_day_average: string
  apr_30_day_average: string
  pending_emission: string
  blocks_until_next_reward: number
  last_reward_block: number
  registrations: number[]
  permits: number[]
  subnet_dominance: SubnetDominance[]
}

// API Response Type
export type ValidatorsData = {
  pagination: Pagination
  data: ValidatorData[]
}

type SevenDayPrice = {
  block_number: number
  timestamp: string // ISO string date format
  price: string // Keeping it as string since it's returned as string
}

export type SubnetPool = {
  netuid: number | string
  block_number: number
  timestamp: string
  name: string
  symbol: string
  market_cap: string
  liquidity: string
  total_tao: string
  total_alpha: string
  alpha_in_pool: string
  alpha_staked: string
  price: string
  price_change_1_hour: string | null
  price_change_1_day: string | null
  price_change_1_week: string | null
  tao_volume_24_hr: string
  tao_buy_volume_24_hr: string
  tao_sell_volume_24_hr: string
  seven_day_prices: SevenDayPrice[]
  buys_24_hr: number
  sells_24_hr: number
  buyers_24_hr: number
  sellers_24_hr: number
}

export type SubnetApiResponse = {
  pagination: Pagination
  data: SubnetPool[]
}

type SubnetIdentity = {
  netuid: number
  subnet_name: string
  github_repo: string | null
  subnet_contact: string | null
  subnet_url: string | null
  discord: string | null
  description: string | null
  additional: string | null
}

export type SubnetIdentityResponse = {
  pagination: Pagination
  data: SubnetIdentity[]
}

export type SubnetData = Partial<SubnetIdentity> &
  Partial<SubnetPool> & {
    descriptionName?: string
  }

export type RuntimePoolData = {
  alphaOut: string
  taoIn: string // TAO in the pool
  alphaIn: string // Alpha in the pool
}

export type Validator = {
  name: string
  url: string
  description: string
  signature: string
}

export type ValidatorsResponse = {
  [key: string]: Validator // The key is the unique validator hotkey.
}

export type BondOption = {
  poolId: string
  name: string
  apr: number
  totalStaked: number
  totalStakers: number
  hasData: boolean
  isError: boolean
  isRecommended?: boolean
}
