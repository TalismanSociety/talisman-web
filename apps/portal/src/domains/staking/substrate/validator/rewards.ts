export type ExposurePage = { pageTotal: bigint; others: { who: string; value: bigint }[] }

export type EraExposure = {
	validators: Map<string, ExposurePage>
	nominating: Map<string, string[]>
}

export type EraInputs = {
	era: number
	exposure: EraExposure
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

export const eraExposureOf = (pages: [validator: string, page: ExposurePage][]): EraExposure => {
	const validators = new Map<string, ExposurePage>()
	const nominating = new Map<string, Set<string>>()
	for (const [validator, page] of pages) {
		validators.set(validator, page)
		for (const { who } of page.others) {
			const targets = nominating.get(who) ?? new Set<string>()
			targets.add(validator)
			nominating.set(who, targets)
		}
	}
	return {
		validators,
		nominating: new Map([...nominating].map(([who, targets]) => [who, [...targets]])),
	}
}

export const exposedValidators = ({ exposure }: EraInputs, stash: string) =>
	exposure.validators.has(stash) ? [stash] : (exposure.nominating.get(stash) ?? [])

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
		for (const validator of exposedValidators(inputs, stash)) {
			const validatorClaimed = validatorLegacyClaimedRewards.get(validator) ?? []
			if (validatorClaimed.includes(inputs.era)) continue
			total += rewardShare(inputs, inputs.exposure.validators.get(validator)!, validator, stash)
		}
	}
	return total
}
