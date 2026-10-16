export type ExposurePage = { pageTotal: bigint; others: { who: string; value: bigint }[] }

export type EraInputs = {
	era: number
	pages: [validator: string, page: ExposurePage][]
	eraPoints: bigint
	validatorPoints: Map<string, bigint>
	commissions: Map<string, bigint>
	eraReward: bigint
}

export type StakerInputs = {
	stash: string
	claimedRewardsEras: number[]
	legacyClaimedRewards: number[]
}

export type ValidatorLegacyClaimedRewards = Map<string, number[]>

const PERBILL = 1_000_000_000n

type EraExposure = { validators: Map<string, ExposurePage>; nominating: string[] }

const exposureOf = ({ pages }: EraInputs, stash: string): EraExposure => {
	const validators = new Map<string, ExposurePage>()
	const nominating: string[] = []
	for (const [validator, page] of pages) {
		validators.set(validator, page)
		if (page.others.some(({ who }) => who === stash)) nominating.push(validator)
	}
	return { validators, nominating }
}

export const exposedValidators = (inputs: EraInputs, stash: string) => {
	const { validators, nominating } = exposureOf(inputs, stash)
	return validators.has(stash) ? [stash] : nominating
}

const rewardShare = (
	{ eraPoints, validatorPoints, commissions, eraReward }: EraInputs,
	page: ExposurePage,
	validator: string,
	stash: string
) => {
	const points = validatorPoints.get(validator) ?? 0n
	if (page.pageTotal === 0n || points === 0n || eraPoints === 0n) return 0n
	const available = (eraReward * points) / eraPoints
	const commission = ((commissions.get(validator) ?? 0n) * available) / PERBILL
	const staked = page.others.find(({ who }) => who === stash)?.value ?? 0n
	const own = validator === stash ? commission : 0n
	return ((available - commission) * staked) / page.pageTotal + own
}

export const stakerRewardsOf = (
	eras: EraInputs[],
	staker: StakerInputs,
	validatorLegacyClaimedRewards: ValidatorLegacyClaimedRewards
) => {
	const { stash, claimedRewardsEras, legacyClaimedRewards } = staker
	let total = 0n
	for (const inputs of eras) {
		if (claimedRewardsEras.includes(inputs.era) || legacyClaimedRewards.includes(inputs.era))
			continue
		const { validators } = exposureOf(inputs, stash)
		for (const validator of exposedValidators(inputs, stash)) {
			const validatorClaimed = validatorLegacyClaimedRewards.get(validator) ?? []
			if (validatorClaimed.includes(inputs.era)) continue
			total += rewardShare(inputs, validators.get(validator)!, validator, stash)
		}
	}
	return total
}
