export type ValidatorsData = {
  count: number
  validators: Validator[]
}

type Validator = {
  block_number: number
  timestamp: string
  registered_at_time: string
  registered_at_block: number
  validator_stake: string
  amount: string
  nominators: number
  amount_change: string
  nominator_change: number
  registrations: number[]
  validator_permits: number[]
  total_daily_return: string
  validator_return: string
  nominator_return_per_k: string
  apr: string
  apr_7_day_average: string
  apr_30_day_average: string
  hot_key: Key
  cold_key: Key
  take: string
  rank: number
  dominance: string
  system_total_stake: string
  nominator_7day_average: string
  nominator_30day_average: string
  subnet_dominance: SubnetDominance[]
}

type Key = {
  ss58: string
  hex: string
}

type SubnetDominance = {
  netuid: number
  dominance: string
}
