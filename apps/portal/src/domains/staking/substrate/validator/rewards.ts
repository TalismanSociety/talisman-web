export type ExposurePage = { others: { who: string; value: bigint }[] }

export type ValidatorExposure = { total: bigint; own: bigint }

export type EraExposure = {
	validators: Map<string, ValidatorExposure>
	stakes: Map<string, Map<string, bigint>>
}

export type EraInputs = {
	era: number
	exposure: EraExposure
	eraPoints: bigint
	validatorPoints: Map<string, bigint>
	commissions: Map<string, bigint>
	eraReward: bigint
}

const PERBILL = 1_000_000_000n

export const eraExposureOf = (
	validators: [validator: string, exposure: ValidatorExposure][],
	pages: [validator: string, page: ExposurePage][]
): EraExposure => {
	const stakes = new Map<string, Map<string, bigint>>()
	for (const [validator, page] of pages) {
		for (const { who, value } of page.others) {
			const byValidator = stakes.get(who) ?? new Map<string, bigint>()
			byValidator.set(validator, value)
			stakes.set(who, byValidator)
		}
	}
	return { validators: new Map(validators), stakes }
}

const exposedValidators = ({ exposure }: EraInputs, stash: string) =>
	exposure.validators.has(stash) ? [stash] : [...(exposure.stakes.get(stash)?.keys() ?? [])]

const rewardShare = (
	{ exposure, eraPoints, validatorPoints, commissions, eraReward }: EraInputs,
	validator: string,
	stash: string
) => {
	const points = validatorPoints.get(validator) ?? 0n
	const total = exposure.validators.get(validator)?.total ?? 0n
	if (total === 0n || points === 0n || eraPoints === 0n) return 0n
	const available = (eraReward * points) / eraPoints
	const commission = ((commissions.get(validator) ?? 0n) * available) / PERBILL
	const staked =
		validator === stash
			? (exposure.validators.get(validator)?.own ?? 0n)
			: (exposure.stakes.get(stash)?.get(validator) ?? 0n)
	const own = validator === stash ? commission : 0n
	return ((available - commission) * staked) / total + own
}

export const stakerRewardsOf = (eras: EraInputs[], stash: string) => {
	let total = 0n
	for (const inputs of eras) {
		for (const validator of exposedValidators(inputs, stash)) {
			total += rewardShare(inputs, validator, stash)
		}
	}
	return total
}
