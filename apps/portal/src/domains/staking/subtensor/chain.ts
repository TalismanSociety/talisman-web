import { bind } from "@react-rxjs/core"
import { combineLatest, defer, map } from "rxjs"

import { getPapiClient } from "@/domains/chains/papi-client"
import type { PortalRuntime } from "@/domains/chains/portal-runtime"

import type { RuntimePoolData } from "./types"

const subtensorApi = (genesisHash: string) =>
	getPapiClient(genesisHash).getUnsafeApi<PortalRuntime>()

export const fetchStakeInfos = (genesisHash: string, address: string) =>
	subtensorApi(genesisHash).apis.StakeInfoRuntimeApi.get_stake_info_for_coldkey(address, {
		at: "best",
	})

export const fetchSubnetPool = async (
	genesisHash: string,
	netuid: number
): Promise<RuntimePoolData | undefined> => {
	const metagraph = await subtensorApi(genesisHash).apis.SubnetInfoRuntimeApi.get_metagraph(
		netuid,
		{ at: "best" }
	)
	return (
		metagraph && {
			alphaIn: String(metagraph.alpha_in),
			alphaOut: String(metagraph.alpha_out),
			taoIn: String(metagraph.tao_in),
		}
	)
}

export type SubtensorMinimums = { stake: bigint; transfer: bigint }

export const fetchMinimums = async (genesisHash: string): Promise<SubtensorMinimums> => {
	const { SubtensorModule } = subtensorApi(genesisHash).constants
	const [stake, transfer] = await Promise.all([
		SubtensorModule.InitialMinStake(),
		SubtensorModule.InitialMinTransfer(),
	])
	return { stake, transfer }
}

export type SubtensorBalance = {
	balance: { free: bigint; reserved: bigint; frozen: bigint }
	existentialDeposit: bigint
}

export const [useSubtensorBalance] = bind((genesisHash: string, address: string) =>
	defer(() => {
		const api = subtensorApi(genesisHash)
		return combineLatest([
			api.query.System.Account.watchValue(address, { at: "best" }),
			api.constants.Balances.ExistentialDeposit(),
		])
	}).pipe(
		map(
			([{ value }, existentialDeposit]): SubtensorBalance => ({
				balance: value.data,
				existentialDeposit,
			})
		)
	)
)
