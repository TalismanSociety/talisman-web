import {
	AccountId,
	bool,
	compact,
	Option,
	Struct,
	u16,
	Vector,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import type { Balance, ExtraAmount } from "@talismn/balances"
import { encodeAnyAddress, isEthereumAddress } from "@talismn/util"
import { catchError, defer, EMPTY, exhaustMap, type Observable, timer } from "rxjs"

import { chainConnectors } from "@/domains/chains/chain-connectors"

export const BITTENSOR_NETWORK_ID = "bittensor"
const SUBTENSOR_STAKE_LABEL = "subtensor-staking"

const ROOT_NETUID = 0
const MIN_STAKE_PLANCK = 1_000_000n
const PRICE_SCALE = 10n ** 9n
const UNPRICED_STAKE_PLANCK = 1n
const POLL_INTERVAL = 30_000

const BittensorAccountId = AccountId(42)

const StakeInfos = Vector(
	Struct({
		hotkey: BittensorAccountId,
		coldkey: BittensorAccountId,
		netuid: compact,
		stake: compact,
		locked: compact,
		emission: compact,
		tao_emission: compact,
		drain: compact,
		isRegistered: bool,
	})
)

const DynamicInfoPool = Option(
	Struct({
		netuid: compact,
		owner_hotkey: BittensorAccountId,
		owner_coldkey: BittensorAccountId,
		subnet_name: Vector(compact),
		token_symbol: Vector(compact),
		tempo: compact,
		last_step: compact,
		blocks_since_last_step: compact,
		emission: compact,
		alpha_in: compact,
		alpha_out: compact,
		tao_in: compact,
	})
)

type SubtensorStakeMeta = { netuid: number; hotkey: string; amountStaked: string }

export type SubtensorStakesByAddress = Map<string, ExtraAmount<string>[]>

type Stake = SubtensorStakeMeta & { address: string; alpha: bigint }

const stateCall = (method: string, params: Uint8Array) =>
	chainConnectors.substrate.send<string>(
		BITTENSOR_NETWORK_ID,
		"state_call",
		[method, toHex(params)],
		false,
		{ expectErrors: true }
	)

const fetchStakes = async (address: string): Promise<Stake[]> => {
	const stakeInfos = StakeInfos.dec(
		await stateCall(
			"StakeInfoRuntimeApi_get_stake_info_for_coldkey",
			BittensorAccountId.enc(address)
		)
	)
	return stakeInfos
		.map(({ hotkey, netuid, stake }) => ({
			address,
			hotkey,
			netuid: Number(netuid),
			alpha: BigInt(stake),
			amountStaked: String(stake),
		}))
		.filter(({ alpha }) => alpha >= MIN_STAKE_PLANCK)
}

const fetchAlphaPrice = async (netuid: number) => {
	const pool = DynamicInfoPool.dec(
		await stateCall("SubnetInfoRuntimeApi_get_dynamic_info", u16.enc(netuid))
	)
	return pool ? (BigInt(pool.tao_in) * PRICE_SCALE) / BigInt(pool.alpha_in) : undefined
}

const fetchAlphaPrices = async (netuids: number[]) =>
	new Map(
		await Promise.all(
			netuids.map(
				async (netuid) => [netuid, await fetchAlphaPrice(netuid).catch(() => undefined)] as const
			)
		)
	)

const toTao = ({ netuid, alpha }: Stake, alphaPrices: Map<number, bigint | undefined>) => {
	if (netuid === ROOT_NETUID) return alpha
	const alphaPrice = alphaPrices.get(netuid)
	return alphaPrice === undefined ? UNPRICED_STAKE_PLANCK : (alpha * alphaPrice) / PRICE_SCALE
}

const fetchStakesByAddress = async (addresses: string[]): Promise<SubtensorStakesByAddress> => {
	const stakes = (await Promise.all(addresses.map(fetchStakes))).flat()
	const alphaPrices = await fetchAlphaPrices([
		...new Set(stakes.map(({ netuid }) => netuid).filter((netuid) => netuid !== ROOT_NETUID)),
	])

	const stakesByAddress: SubtensorStakesByAddress = new Map()
	for (const stake of stakes) {
		const key = encodeAnyAddress(stake.address)
		const meta: SubtensorStakeMeta = {
			netuid: stake.netuid,
			hotkey: stake.hotkey,
			amountStaked: stake.amountStaked,
		}
		stakesByAddress.set(key, [
			...(stakesByAddress.get(key) ?? []),
			{
				type: "extra",
				label: SUBTENSOR_STAKE_LABEL,
				amount: String(toTao(stake, alphaPrices)),
				includeInTotal: true,
				meta,
			},
		])
	}
	return stakesByAddress
}

export const getSubtensorStakes = (balance: Balance) =>
	(balance.extra ?? [])
		.filter(({ label }) => label === SUBTENSOR_STAKE_LABEL)
		.map(({ amount, meta }) => ({ ...(meta as SubtensorStakeMeta), taoPlanck: BigInt(amount) }))

export const subtensorStakes$ = (addresses: string[]): Observable<SubtensorStakesByAddress> => {
	const substrateAddresses = addresses.filter((address) => !isEthereumAddress(address))
	if (substrateAddresses.length === 0) return EMPTY

	return timer(0, POLL_INTERVAL).pipe(
		exhaustMap(() =>
			defer(() => fetchStakesByAddress(substrateAddresses)).pipe(catchError(() => EMPTY))
		)
	)
}
