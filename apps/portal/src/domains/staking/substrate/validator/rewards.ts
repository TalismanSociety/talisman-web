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

type EraExposure = { validators: Map<string, ExposurePage>; exposed: string[] }

const exposureOf = ({ pages }: EraInputs, stash: string): EraExposure => {
	const validators = new Map<string, ExposurePage>()
	const nominating: string[] = []
	for (const [validator, page] of pages) {
		validators.set(validator, page)
		if (page.others.some(({ who }) => who === stash)) nominating.push(validator)
	}
	return { validators, exposed: validators.has(stash) ? [stash] : nominating }
}

export const exposedValidators = (inputs: EraInputs, stash: string) =>
	exposureOf(inputs, stash).exposed

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
		const { validators, exposed } = exposureOf(inputs, stash)
		for (const validator of exposed) {
			const validatorClaimed = validatorLegacyClaimedRewards.get(validator) ?? []
			if (validatorClaimed.includes(inputs.era)) continue
			total += rewardShare(inputs, validators.get(validator)!, validator, stash)
		}
	}
	return total
}
