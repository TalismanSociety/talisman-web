import { AccountId } from "@polkadot-api/substrate-bindings"
import { fromUnixTime, isAfter, isBefore, max as maxDate, startOfDay } from "date-fns"
import { map, switchMap } from "rxjs"
import { Decimal } from "@/util/Decimal"
import { bindSuspended } from "@/util/loadable"

import { chainTokenOf, ss58PrefixOf } from "../chain"
import { chainRuntimes$ } from "./useRuntimes"

type SubscanPayout = {
	pool_id: number
	module_id: string
	event_id: string
	extrinsic_index: string
	event_index: string
	block_timestamp: number
	amount: string
	account_display: { address: string }
}

type SubscanNominationPoolRewardsResponse = {
	code: number
	message: string
	generated_at: number
	data: { count: number; list: readonly SubscanPayout[] }
}

type PoolPayout = { date: Date; amount: Decimal }

const PAGE_SIZE = 100

async function* subscanPayouts(
	subscanUrl: string,
	address: string,
	poolId: number,
	fromDate: Date | undefined
) {
	let page = 0
	while (true) {
		const response: SubscanNominationPoolRewardsResponse = await fetch(
			new URL("api/scan/nomination_pool/rewards", subscanUrl.replace("subscan", "api.subscan")),
			{
				method: "POST",
				body: JSON.stringify({ address, pool_id: poolId, row: PAGE_SIZE, page }),
			}
		).then(async (x) => await x.json())

		yield* response.data.list

		if (response.data.list.length === 0 || response.data.list.length < PAGE_SIZE) break
		if (fromDate === undefined) break
		if (
			isBefore(
				startOfDay(maxDate(response.data.list.map((x) => fromUnixTime(x.block_timestamp)))),
				startOfDay(fromDate)
			)
		)
			break
		page += 1
	}
}

const fetchPayouts = async (
	subscanUrl: string,
	address: string,
	poolId: number,
	fromDate: Date | undefined,
	toDate: Date | undefined
) => {
	const payouts: SubscanPayout[] = []
	for await (const payout of subscanPayouts(subscanUrl, address, poolId, fromDate)) {
		const date = startOfDay(fromUnixTime(payout.block_timestamp))
		if (fromDate !== undefined && toDate !== undefined) {
			if (isBefore(date, startOfDay(fromDate)) || isAfter(date, startOfDay(toDate))) continue
		}
		payouts.push(payout)
	}
	return payouts
}

const dayOf = (time: number) => (time === 0 ? undefined : startOfDay(new Date(time)))

const [usePayouts] = bindSuspended(
	(
		genesisHash: string,
		subscanUrl: string,
		account: string,
		poolId: number,
		from: number,
		to: number
	) =>
		chainRuntimes$(genesisHash).pipe(
			switchMap(({ runtime }) => {
				const { decimals, symbol } = chainTokenOf(runtime)
				const address = AccountId(ss58PrefixOf(runtime)).dec(AccountId().enc(account))
				return fetchPayouts(subscanUrl, address, poolId, dayOf(from), dayOf(to)).then((payouts) =>
					payouts.map(
						(payout): PoolPayout => ({
							date: fromUnixTime(payout.block_timestamp),
							amount: Decimal.fromPlanck(payout.amount, decimals, { currency: symbol }),
						})
					)
				)
			})
		)
)

export const usePoolPayouts = (
	genesisHash: string,
	subscanUrl: string | undefined,
	account: string,
	poolId: number,
	fromDate?: Date,
	toDate?: Date
) =>
	usePayouts(
		genesisHash,
		subscanUrl ?? "",
		account,
		poolId,
		fromDate ? startOfDay(fromDate).getTime() : 0,
		toDate ? startOfDay(toDate).getTime() : 0
	)

export const [useChainAddress] = bindSuspended((genesisHash: string, account: string) =>
	chainRuntimes$(genesisHash).pipe(
		map(({ runtime }) => AccountId(ss58PrefixOf(runtime)).dec(AccountId().enc(account)))
	)
)
