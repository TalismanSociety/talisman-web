import type {
	ApisTypedef,
	ChainDefinition,
	DescriptorValues,
	PalletsTypedef,
	PlainDescriptor,
	RuntimeDescriptor,
	SS58String,
	StorageDescriptor,
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

type SlashingSpansValue = {
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
		AreNominatorsSlashable: StorageDescriptor<[], boolean, false, never>
	}
	Session: { CurrentIndex: StorageDescriptor<[], number, false, never> }
	Babe: {
		CurrentSlot: StorageDescriptor<[], bigint, false, never>
		EpochIndex: StorageDescriptor<[], bigint, false, never>
		GenesisSlot: StorageDescriptor<[], bigint, false, never>
	}
	Identity: { IdentityOf: StorageDescriptor<[SS58String], unknown, true, never> }
}

type Constants = {
	Balances: { ExistentialDeposit: PlainDescriptor<bigint> }
}

type Calls = {
	NominationPools: { claim_payout: TxDescriptor<undefined> }
}

type Apis = ApisTypedef<{
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
