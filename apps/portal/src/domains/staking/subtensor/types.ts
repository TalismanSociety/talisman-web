export type BittensorValidator = {
	hotkey: string
	name: string
	global_weighted_stake: string
	global_nominators: number
}

export type ValidatorYield = {
	hotkey: string
	thirty_day_apy: number
}

export type SubnetPool = {
	netuid: number
	total_tao: string
	total_alpha: string
}

export type BittensorSubnet = {
	netuid: number
	descriptionName: string
	symbol: string
}

export type SubnetData = Partial<BittensorSubnet & SubnetPool>

export type RuntimePoolData = {
	alphaOut: string
	taoIn: string
	alphaIn: string
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
