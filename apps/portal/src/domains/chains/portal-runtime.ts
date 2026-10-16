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

type Storage = {
	System: { Account: StorageDescriptor<[SS58String], AccountInfo, false, never> }
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
}>

export type PortalRuntime = Omit<ChainDefinition, "descriptors"> & {
	descriptors: Promise<DescriptorValues> & {
		pallets: PalletsTypedef<Storage, Calls, None, None, Constants, None>
		apis: Apis
	}
}
