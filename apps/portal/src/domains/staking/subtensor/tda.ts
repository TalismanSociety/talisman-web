import { z } from "zod"

import type { BittensorValidator, SubnetPool, ValidatorYield } from "./types"

const planck = z
	.union([z.string().regex(/^\d+$/), z.number().int().nonnegative()])
	.transform((value) => (typeof value === "number" ? BigInt(value).toString() : value))

const tdaValidators = z.array(
	z.object({
		hotkey: z.string(),
		name: z.string().nullable(),
		global_weighted_stake: z.string(),
		global_nominators: z.number(),
		active_subnets: z.number(),
	})
)

const tdaPools = z.array(
	z.object({
		netuid: z.number().int(),
		total_tao: planck,
		total_alpha: planck,
	})
)

const tdaSubnetValidators = z.array(
	z.object({
		hotkey: z.string(),
		thirty_day_apy: z.number().nullable(),
	})
)

export const validatorYieldsInput = z.object({ netuid: z.number().int().min(0).max(65535) })

export const toValidators = (payload: unknown): BittensorValidator[] =>
	tdaValidators
		.parse(payload)
		.filter((validator) => validator.active_subnets > 0)
		.map(({ hotkey, name, global_weighted_stake, global_nominators }) => ({
			hotkey,
			name: name ?? "",
			global_weighted_stake,
			global_nominators,
		}))

export const toSubnetPools = (payload: unknown): SubnetPool[] =>
	tdaPools.parse(payload).map(({ netuid, total_tao, total_alpha }) => ({
		netuid,
		total_tao,
		total_alpha,
	}))

export const toValidatorYields = (payload: unknown): ValidatorYield[] =>
	tdaSubnetValidators
		.parse(payload)
		.flatMap(({ hotkey, thirty_day_apy }) =>
			thirty_day_apy === null ? [] : [{ hotkey, thirty_day_apy }]
		)
