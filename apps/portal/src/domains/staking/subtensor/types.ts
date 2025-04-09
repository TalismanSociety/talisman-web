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

// Validator Data Type
type ValidatorData = {
  hotkey: Key
  coldkey: Key
  name: string
  block_number: number
  timestamp: string
  created_on_date: string
  rank: number
  root_rank: number
  alpha_rank: number
  active_subnets: number
  global_nominators: number
  global_nominators_24_hr_change: number
  take: string
  global_weighted_stake: string
  global_weighted_stake_24_hr_change: string
  global_alpha_stake_as_tao: string
  root_stake: string
  weighted_root_stake: string
  dominance: string
  dominance_24_hr_change: string
  nominator_return_per_day: string
  validator_return_per_day: string
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
  totalStaked: number
  totalStakers: number
  hasData: boolean
  isError: boolean
  isRecommended?: boolean
}
