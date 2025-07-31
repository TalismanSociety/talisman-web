type Pagination = {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
  next_page: number | null
  prev_page: number | null
}

type Address = {
  ss58: string
  hex: string
}

// Validator Data Type
export type ValidatorData = {
  hotkey: Address
  coldkey: Address
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

export type BondOption = {
  poolId: string
  name: string
  totalStaked: number
  totalStakers: number
  hasData: boolean
  isError: boolean
  isRecommended?: boolean
  validatorYield?: ValidatorYield
}

type ValidatorYield = {
  hotkey: Address
  name: string
  netuid: number
  block_number: number
  timestamp: string // ISO 8601 format
  stake: string // stringified number, possibly a bigint
  one_hour_apy: string
  one_day_apy: string
  seven_day_apy: string
  thirty_day_apy: string
  one_day_epoch_participation: number | null
  seven_day_epoch_participation: number | null
  thirty_day_epoch_participation: number | null
}

export type ValidatorsYieldApiResponse = {
  pagination: Pagination
  data: ValidatorYield[]
}
type DelegateAction = 'DELEGATE' | 'UNDELEGATE'

type DelegateEvent = {
  id: string
  block_number: number
  timestamp: string // ISO 8601 timestamp
  action: DelegateAction
  nominator: Address
  delegate: Address
  amount: string // TAO as rao (smallest unit)
  alpha: string | null // alpha as rao
  usd: string | null // USD string value
  alpha_price_in_tao: string | null // stringified decimal
  alpha_price_in_usd: string | null // stringified decimal
  netuid: number | null
  extrinsic_id: string | null
  is_transfer: boolean | null
  transfer_address: string | null
}

export type DelegationEventsApiResponse = {
  pagination: Pagination
  data: DelegateEvent[]
}

export type DTaoStakeBalance = {
  block_number: number
  timestamp: string // ISO 8601 string format
  hotkey_name: string
  hotkey: Address
  coldkey: Address
  netuid: number
  subnet_rank: number
  subnet_total_holders: number
  balance: string // raw string, assuming it's in atomic units
  balance_as_tao: string // same as above; parsed display value may need BigInt/Decimal
}

export type DTaoStakeBalanceApiResponse = {
  pagination: Pagination
  data: DTaoStakeBalance[]
}
