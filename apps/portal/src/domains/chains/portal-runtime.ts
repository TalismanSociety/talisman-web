import type {
	ChainDefinition,
	DescriptorValues,
	PalletsTypedef,
	PlainDescriptor,
	TxDescriptor,
} from "polkadot-api"

type None = Record<never, never>

export type DispatchError = { type: string; value?: unknown }

type Constants = {
	Balances: { ExistentialDeposit: PlainDescriptor<bigint> }
}

type Calls = {
	NominationPools: { claim_payout: TxDescriptor<undefined> }
}

export type PortalRuntime = Omit<ChainDefinition, "descriptors"> & {
	descriptors: Promise<DescriptorValues> & {
		pallets: PalletsTypedef<None, Calls, None, None, Constants, None>
		apis: None
	}
}
