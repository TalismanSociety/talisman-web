import type {
	ApisTypedef,
	ChainDefinition,
	DescriptorValues,
	Enum,
	PalletsTypedef,
	PlainDescriptor,
	RuntimeDescriptor,
	SizedHex,
	SS58String,
	StorageDescriptor,
	TxCallData,
	TxDescriptor,
} from "polkadot-api"

type None = Record<never, never>

export type DispatchError = { type: string; value?: unknown }

type AccountInfo = {
	nonce: number
	consumers: number
	providers: number
	sufficients: number
	data: { free: bigint; reserved: bigint; frozen: bigint; flags: bigint }
}

type SubtensorStakeInfo = {
	hotkey: SS58String
	coldkey: SS58String
	netuid: number
	stake: bigint
}

type SubnetMetagraph = { alpha_in: bigint; alpha_out: bigint; tao_in: bigint }

export type PoolMemberValue = {
	pool_id: number
	points: bigint
	last_recorded_reward_counter: bigint
	unbonding_eras: [era: number, amount: bigint][]
}

type PoolState = { type: "Open" | "Blocked" | "Destroying"; value: undefined }

export type BondedPoolValue = {
	commission: { current?: [perbill: number, payee: SS58String] }
	member_counter: number
	points: bigint
	roles: { depositor: SS58String; root?: SS58String; nominator?: SS58String; bouncer?: SS58String }
	state: PoolState
}

export type ClaimPermissionValue = {
	type: "Permissioned" | "PermissionlessCompound" | "PermissionlessWithdraw" | "PermissionlessAll"
	value: undefined
}

type ActiveEraInfo = { index: number; start?: bigint }

type NominationsValue = { targets: SS58String[]; submitted_in: number; suppressed: boolean }

export type SlashingSpansValue = {
	span_index: number
	last_start: number
	last_nonzero_slash: number
	prior: number[]
}

type PagedExposureMetadata = {
	total: bigint
	own: bigint
	nominator_count: number
	page_count: number
}

type Exposure = { total: bigint; own: bigint; others: { who: SS58String; value: bigint }[] }

type ExposurePageValue = { page_total: bigint; others: { who: SS58String; value: bigint }[] }

export type StakingLedgerValue = {
	stash: SS58String
	total: bigint
	active: bigint
	unlocking: { value: bigint; era: number }[]
	legacy_claimed_rewards?: number[]
	claimed_rewards?: number[]
}

type EraRewardPoints = { total: number; individual: [SS58String, number][] }

type ValidatorPrefs = { commission: number; blocked: boolean }

export type SmartContract = Enum<{ Evm: SizedHex<20>; Wasm: SS58String }>

export type StakeAmount = { voting: bigint; build_and_earn: bigint; era: number; period: number }

export type ProtocolState = {
	era: number
	next_era_start: number
	period_info: {
		number: number
		subperiod: Enum<{ Voting: undefined; BuildAndEarn: undefined }>
		next_subperiod_start_era: number
	}
	maintenance: boolean
}

export type AccountLedger = {
	locked: bigint
	unlocking: Array<{ amount: bigint; unlock_block: number }>
	staked: StakeAmount
	staked_future: StakeAmount | undefined
	contract_stake_count: number
}

export type SingularStakingInfo = {
	previous_staked: StakeAmount
	staked: StakeAmount
	bonus_status: number
}

type ContractStakeAmount = { staked: StakeAmount; staked_future: StakeAmount | undefined }

type DAppInfo = { owner: SS58String; id: number; reward_beneficiary: SS58String | undefined }

export type EraRewardSpan = {
	span: Array<{ staker_reward_pool: bigint; staked: bigint; dapp_reward_pool: bigint }>
	first_era: number
	last_era: number
}

type PeriodEndInfo = { bonus_reward_pool: bigint; total_vp_stake: bigint; final_era: number }

export type EraInfo = {
	total_locked: bigint
	unlocking: bigint
	current_stake_amount: StakeAmount
	next_stake_amount: StakeAmount
}

export type InflationParameters = {
	max_inflation_rate: bigint
	treasury_part: bigint
	collators_part: bigint
	dapps_part: bigint
	base_stakers_part: bigint
	adjustable_stakers_part: bigint
	bonus_part: bigint
	ideal_staking_rate: bigint
	decay_rate: bigint
}

export type InflationConfiguration = {
	recalculation_era: number
	issuance_safety_cap: bigint
	collator_reward_per_block: bigint
	treasury_reward_per_block: bigint
	dapp_reward_pool_per_era: bigint
	base_staker_reward_pool_per_era: bigint
	adjustable_staker_reward_pool_per_era: bigint
	bonus_reward_pool_per_period: bigint
	ideal_staking_rate: bigint
	decay_rate: bigint
	decay_factor: bigint
}

type Storage = {
	System: { Account: StorageDescriptor<[SS58String], AccountInfo, false, never> }
	Balances: { TotalIssuance: StorageDescriptor<[], bigint, false, never> }
	NominationPools: {
		PoolMembers: StorageDescriptor<[SS58String], PoolMemberValue, true, never>
		BondedPools: StorageDescriptor<[number], BondedPoolValue, true, never>
		Metadata: StorageDescriptor<[number], Uint8Array, false, never>
		ClaimPermissions: StorageDescriptor<[SS58String], ClaimPermissionValue, false, never>
		MinJoinBond: StorageDescriptor<[], bigint, false, never>
		CounterForRewardPools: StorageDescriptor<[], number, false, never>
	}
	Staking: {
		ActiveEra: StorageDescriptor<[], ActiveEraInfo, true, never>
		CurrentEra: StorageDescriptor<[], number, true, never>
		ErasStartSessionIndex: StorageDescriptor<[number], number, true, never>
		Nominators: StorageDescriptor<[SS58String], NominationsValue, true, never>
		SlashingSpans: StorageDescriptor<[SS58String], SlashingSpansValue, true, never>
		ErasValidatorReward: StorageDescriptor<[number], bigint, true, never>
		ErasTotalStake: StorageDescriptor<[number], bigint, false, never>
		ErasStakersOverview: StorageDescriptor<[number, SS58String], PagedExposureMetadata, true, never>
		ErasStakers: StorageDescriptor<[number, SS58String], Exposure, false, never>
		ErasStakersPaged: StorageDescriptor<
			[number, SS58String, number],
			ExposurePageValue,
			true,
			never
		>
		ErasRewardPoints: StorageDescriptor<[number], EraRewardPoints, false, never>
		ErasValidatorPrefs: StorageDescriptor<[number, SS58String], ValidatorPrefs, false, never>
		ClaimedRewards: StorageDescriptor<[number, SS58String], number[], false, never>
		Bonded: StorageDescriptor<[SS58String], SS58String, true, never>
		Ledger: StorageDescriptor<[SS58String], StakingLedgerValue, true, never>
		MinNominatorBond: StorageDescriptor<[], bigint, false, never>
		AreNominatorsSlashable: StorageDescriptor<[], boolean, false, never>
	}
	Session: { CurrentIndex: StorageDescriptor<[], number, false, never> }
	Babe: {
		CurrentSlot: StorageDescriptor<[], bigint, false, never>
		EpochIndex: StorageDescriptor<[], bigint, false, never>
		GenesisSlot: StorageDescriptor<[], bigint, false, never>
	}
	Identity: { IdentityOf: StorageDescriptor<[SS58String], unknown, true, never> }
	DappStaking: {
		ActiveProtocolState: StorageDescriptor<[], ProtocolState, false, never>
		Ledger: StorageDescriptor<[SS58String], AccountLedger, false, never>
		StakerInfo: StorageDescriptor<[SS58String, SmartContract], SingularStakingInfo, true, never>
		ContractStake: StorageDescriptor<[number], ContractStakeAmount, false, never>
		IntegratedDApps: StorageDescriptor<[SmartContract], DAppInfo, true, never>
		EraRewards: StorageDescriptor<[number], EraRewardSpan, true, never>
		PeriodEnd: StorageDescriptor<[number], PeriodEndInfo, true, never>
		CurrentEraInfo: StorageDescriptor<[], EraInfo, false, never>
	}
	Inflation: {
		InflationParams: StorageDescriptor<[], InflationParameters, false, never>
		ActiveInflationConfig: StorageDescriptor<[], InflationConfiguration, false, never>
	}
}

type Constants = {
	Balances: { ExistentialDeposit: PlainDescriptor<bigint> }
	DappStaking: {
		EraRewardSpanLength: PlainDescriptor<number>
		RewardRetentionInPeriods: PlainDescriptor<number>
		MinimumStakeAmount: PlainDescriptor<bigint>
		MaxNumberOfStakedContracts: PlainDescriptor<number>
		UnlockingPeriod: PlainDescriptor<number>
	}
	Timestamp: { MinimumPeriod: PlainDescriptor<bigint> }
}

type ContractAmount = { smart_contract: SmartContract; amount: bigint }

type Calls = {
	NominationPools: { claim_payout: TxDescriptor<undefined> }
	DappStaking: {
		lock: TxDescriptor<{ amount: bigint }>
		unlock: TxDescriptor<{ amount: bigint }>
		stake: TxDescriptor<ContractAmount>
		unstake: TxDescriptor<ContractAmount>
		withdraw_unbonded: TxDescriptor<undefined>
		cleanup_expired_entries: TxDescriptor<undefined>
		claim_staker_rewards: TxDescriptor<undefined>
	}
	Utility: { batch_all: TxDescriptor<{ calls: TxCallData[] }> }
}

type Apis = ApisTypedef<{
	DappStakingApi: {
		periods_per_cycle: RuntimeDescriptor<[], number>
		eras_per_voting_subperiod: RuntimeDescriptor<[], number>
		eras_per_build_and_earn_subperiod: RuntimeDescriptor<[], number>
		blocks_per_era: RuntimeDescriptor<[], number>
	}
	StakeInfoRuntimeApi: {
		get_stake_info_for_coldkey: RuntimeDescriptor<[coldkey: SS58String], SubtensorStakeInfo[]>
	}
	SubnetInfoRuntimeApi: {
		get_metagraph: RuntimeDescriptor<[netuid: number], SubnetMetagraph | undefined>
	}
	NominationPoolsApi: {
		pending_rewards: RuntimeDescriptor<[member: SS58String], bigint>
	}
}>

export type PortalRuntime = Omit<ChainDefinition, "descriptors"> & {
	descriptors: Promise<DescriptorValues> & {
		pallets: PalletsTypedef<Storage, Calls, None, None, Constants, None>
		apis: Apis
	}
}
