import type { TxCallData } from "polkadot-api"

const call = (name: string, args?: object): TxCallData => ({
	type: "Staking",
	value: { type: name, value: args },
})

export const unbondCall = (value: bigint) => call("unbond", { value })

const chillCall = () => call("chill")

export const withdrawUnbondedCall = (slashingSpans: number) =>
	call("withdraw_unbonded", { num_slashing_spans: slashingSpans })

export const unbondAllCall = (active: bigint): TxCallData => ({
	type: "Utility",
	value: { type: "batch_all", value: { calls: [chillCall(), unbondCall(active)] } },
})

export type UnbondAction = { type: "unbond"; value: bigint } | { type: "unbondAll"; active: bigint }

export const unbondActionCall = (action: UnbondAction) =>
	action.type === "unbond" ? unbondCall(action.value) : unbondAllCall(action.active)
