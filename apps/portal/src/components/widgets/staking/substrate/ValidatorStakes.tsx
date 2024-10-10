import { selectedSubstrateAccountsState } from '../../../../domains/accounts/recoils'
import { useChainState } from '../../../../domains/chains'
import { useSubstrateApiState } from '../../../../domains/common'
import { useInjectedAccountFastUnstakeEligibility } from '../../../../domains/fastUnstake'
import { useStakersRewardState } from '../../../../domains/staking/substrate/validator/recoils'
import ErrorBoundary from '../../ErrorBoundary'
import ValidatorStakeItem from './ValidatorStakeItem'
import { StakePositionErrorBoundary } from '@/components/recipes/StakePosition'
import { useDeriveState, useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

const useStakes = () => {
  const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)

  const accounts = accountsLoadable.valueMaybe()

  const addresses = useMemo(() => {
    if (!accounts) return []
    return accounts.map(x => x.address)
  }, [accounts])

  const { state: loadableState, contents: loadableContents } = useRecoilValueLoadable(
    waitForAll([
      useQueryState('staking', 'activeEra', []),
      useDeriveState('staking', 'accounts', [addresses, undefined]),
    ])
  )

  const [activeEra, stakes] = loadableState === 'hasValue' ? loadableContents : []

  const slashingSpansLoadable = useRecoilValueLoadable(
    useQueryState('staking', 'slashingSpans.multi', stakes?.map(staking => staking.stashId) ?? [])
  )

  const stakerRewardsLoadable = useRecoilValueLoadable(
    useStakersRewardState(activeEra?.unwrapOrDefault().index.toNumber() || 0)
  )

  const data = useMemo(() => {
    if (!accounts) return []
    return (
      stakes
        ?.map((stake, index) => {
          const reward = stakerRewardsLoadable.valueMaybe()?.[accounts[index]?.address ?? '']
          return {
            stake,
            account: accounts[index]!,
            reward,
            slashingSpan: (slashingSpansLoadable.contents[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
            inFastUnstakeQueue: false,
          }
        })
        .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero()) ?? []
    )
  }, [accounts, slashingSpansLoadable.contents, stakerRewardsLoadable, stakes])

  return { data, state: slashingSpansLoadable.state }
}

const useStakesWithFastUnstake = () => {
  const { data: stakes } = useStakes()

  const { state, contents } = useRecoilValueLoadable(
    waitForAll([
      useSubstrateApiState(),
      useQueryState(
        'fastUnstake',
        'queue.multi',
        useMemo(() => stakes.map(x => x.account.address), [stakes])
      ),
    ])
  )

  const { state: multiQueryState, contents: multiQueryContent } = useRecoilValueLoadable(
    useQueryMultiState(['fastUnstake.erasToCheckPerBlock', 'fastUnstake.head'])
  )

  const [erasToCheckPerBlock, fastUnstakeHead] = multiQueryState === 'hasValue' ? multiQueryContent : []

  const [api, queues = []] = state === 'hasValue' ? contents : []
  const accountEligibilityLoadable = useInjectedAccountFastUnstakeEligibility()

  const data = stakes.map((x, index) => ({
    ...x,
    eligibleForFastUnstake:
      !erasToCheckPerBlock?.isZero() &&
      accountEligibilityLoadable[x.account.address] &&
      (x.stake.redeemable?.isZero() ?? true) &&
      (x.stake.unlocking?.length ?? 0) === 0,
    inFastUnstakeHead: fastUnstakeHead?.unwrapOrDefault().stashes.some(y => y[0].eq(x.stake.accountId)),
    inFastUnstakeQueue: queues[index]?.unwrapOrDefault().isZero() === false,
    fastUnstakeDeposit: api?.consts.fastUnstake.deposit,
  }))
  return { data, state }
}

const BaseValidatorStakes = ({ setShouldRenderLoadingSkeleton }: ValidatorStakesProps) => {
  const { data: stakes, state } = useStakes()
  const chainLoadable = useRecoilValueLoadable(useChainState())
  const chain = chainLoadable.valueMaybe()

  if (state === 'hasValue' || stakes.length) {
    setShouldRenderLoadingSkeleton(false)
  }

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  return (
    <>
      {stakes.map((props, index) => {
        const { account, reward } = props
        const stakeStatus = reward === undefined ? undefined : reward === 0n ? 'not_earning_rewards' : 'earning_rewards'

        return (
          <ErrorBoundary
            key={index}
            renderFallback={() => (
              <StakePositionErrorBoundary
                chain={name}
                assetSymbol={symbol}
                assetLogoSrc={logo}
                account={account}
                provider="Validator staking"
                stakeStatus={stakeStatus}
              />
            )}
          >
            <ValidatorStakeItem key={index} {...props} eligibleForFastUnstake={false} />
          </ErrorBoundary>
        )
      })}
    </>
  )
}

const ValidatorStakesWithFastUnstake = ({ setShouldRenderLoadingSkeleton }: ValidatorStakesProps) => {
  const { data: stakes, state } = useStakesWithFastUnstake()
  const chainLoadable = useRecoilValueLoadable(useChainState())
  const chain = chainLoadable.valueMaybe()

  if (stakes.length || state === 'hasValue') {
    setShouldRenderLoadingSkeleton(false)
  }

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  return (
    <>
      {stakes.map((props, index) => {
        const { account, reward } = props
        const stakeStatus = reward === undefined ? undefined : reward === 0n ? 'not_earning_rewards' : 'earning_rewards'
        return (
          <ErrorBoundary
            key={index}
            renderFallback={() => (
              <StakePositionErrorBoundary
                chain={name}
                assetSymbol={symbol}
                assetLogoSrc={logo}
                account={account}
                provider="Validator staking"
                stakeStatus={stakeStatus}
              />
            )}
          >
            <ValidatorStakeItem {...props} />
          </ErrorBoundary>
        )
      })}
    </>
  )
}

type ValidatorStakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const ValidatorStakes = ({ setShouldRenderLoadingSkeleton }: ValidatorStakesProps) => {
  const apiLoadable = useRecoilValueLoadable(useSubstrateApiState())

  const api = apiLoadable.valueMaybe()

  return api?.query.fastUnstake !== undefined ? (
    <ValidatorStakesWithFastUnstake setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
  ) : (
    <BaseValidatorStakes setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
  )
}

export default ValidatorStakes
