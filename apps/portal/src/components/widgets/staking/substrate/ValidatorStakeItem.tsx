import { type DeriveStakingAccount } from '@polkadot/api-derive/types'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import BN from 'bn.js'
import { useMemo, useState } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import FastUnstakeDialog from '@/components/recipes/FastUnstakeDialog'
import StakePosition from '@/components/recipes/StakePosition'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { type Account } from '@/domains/accounts/recoils'
import { useChainState, useNativeTokenDecimalState, useNativeTokenPriceState } from '@/domains/chains'
import { useSubstrateApiState } from '@/domains/common'
import { useExtrinsic, useNativeTokenLocalizedFiatAmount, useTokenAmountFromPlanck } from '@/domains/common/hooks'
import { useEraEtaFormatter } from '@/domains/common/hooks/useEraEta'
import { useLocalizedUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { useTotalValidatorStakingRewards } from '@/domains/staking/substrate/validator'

import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const TotalRewards = (props: { account: Account }) => {
  const { totalRewards, isError } = useTotalValidatorStakingRewards(props.account)
  if (isError) return '--'

  return totalRewards.toLocaleString()
}

const TotalFiatRewards = (props: { account: Account }) => {
  const { totalRewards, isError } = useTotalValidatorStakingRewards(props.account)
  const totalFiatRewards = useNativeTokenLocalizedFiatAmount(totalRewards)
  if (isError) return null

  return totalFiatRewards
}

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  slashingSpan: number
  eligibleForFastUnstake?: boolean
  inFastUnstakeHead?: boolean
  inFastUnstakeQueue?: boolean
  fastUnstakeDeposit?: BN
}) => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')
  const fastUnstake = useExtrinsic('fastUnstake', 'registerFastUnstake')

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)
  const [isFastUnstakeDialogOpen, setIsFastUnstakeDialogOpen] = useState(false)

  const lockDuration = useLocalizedUnlockDuration()

  const { state, contents } = useRecoilValueLoadable(
    waitForAll([
      useChainState(),
      useSubstrateApiState(),
      useDeriveState('balances', 'all', [props.account.address]),
      useNativeTokenDecimalState(),
      useNativeTokenPriceState(),
    ])
  )

  const [chain, api, balances, decimal, nativeTokenPrice] = state === 'hasValue' ? contents : []

  const amount = useTokenAmountFromPlanck(
    props.inFastUnstakeQueue || props.inFastUnstakeHead
      ? props.stake.unlocking?.[0]?.value
      : props.stake.stakingLedger.active.unwrap()
  )

  const active = decimal?.fromPlanck(props.stake.stakingLedger.active.toBigInt())

  const totalUnlocking = useMemo(
    () => props.stake.unlocking?.reduce((previous, current) => previous.add(current.value), new BN(0)),
    [props.stake.unlocking]
  )

  const hasEnoughDepositForFastUnstake = useMemo(() => {
    if (!balances || !api) return false
    return balances.availableBalance.gte(
      api.consts.balances.existentialDeposit.add(props.fastUnstakeDeposit ?? new BN(0))
    )
  }, [api, balances, props.fastUnstakeDeposit])

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = props.stake.unlocking?.map(x => ({
    amount: decimal?.fromPlanck(x.value.toBigInt()).toLocaleString(),
    eta: eraEtaFormatter(x.remainingEras) ?? <CircularProgressIndicator size="1em" />,
  }))

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  const onRequestUnstake = () => {
    if (props.eligibleForFastUnstake || props.eligibleForFastUnstake === undefined) {
      setIsFastUnstakeDialogOpen(true)
    } else {
      setIsUnstakeDialogOpen(true)
    }
  }

  return (
    <>
      <StakePosition
        chain={name}
        chainId={chain?.id ?? ''}
        assetSymbol={symbol}
        assetLogoSrc={logo}
        provider="Validator staking"
        stakeStatus={
          props.reward === undefined ? undefined : props.reward === 0n ? 'not_earning_rewards' : 'earning_rewards'
        }
        readonly={props.account.readonly}
        account={props.account}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <RedactableBalance>{active?.toLocaleString()}</RedactableBalance>
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <AnimatedFiatNumber end={active && nativeTokenPrice ? active.toNumber() * nativeTokenPrice : 0} />
          </ErrorBoundary>
        }
        rewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <TotalRewards account={props.account} />
          </ErrorBoundary>
        }
        fiatRewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <TotalFiatRewards account={props.account} />
          </ErrorBoundary>
        }
        unstakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.UnstakeButton onClick={onRequestUnstake} />
          </ErrorBoundary>
        }
        withdrawButton={
          props.stake.redeemable?.isZero() === false && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.WithdrawButton
                amount={
                  <RedactableBalance>
                    {decimal?.fromPlanck(props.stake.redeemable.toBigInt()).toLocaleString()}
                  </RedactableBalance>
                }
                onClick={() => {
                  void withdrawExtrinsic.signAndSend(props.stake.controllerId ?? '', props.slashingSpan)
                }}
                loading={withdrawExtrinsic.state === 'loading'}
              />
            </ErrorBoundary>
          )
        }
        unstakingStatus={
          <ErrorBoundary renderFallback={() => <>--</>}>
            {totalUnlocking?.isZero() === false ? (
              props.inFastUnstakeHead || props.inFastUnstakeQueue ? (
                <StakePosition.FastUnstakingStatus
                  amount={
                    <RedactableBalance>
                      {decimal?.fromPlanck(totalUnlocking.toString()).toLocaleString()}
                    </RedactableBalance>
                  }
                  status={props.inFastUnstakeHead ? 'in-head' : props.inFastUnstakeQueue ? 'in-queue' : undefined}
                />
              ) : (
                <StakePosition.UnstakingStatus
                  amount={
                    <RedactableBalance>
                      {decimal?.fromPlanck(totalUnlocking.toString()).toLocaleString()}
                    </RedactableBalance>
                  }
                  unlocks={unlocks ?? []}
                />
              )
            ) : undefined}
          </ErrorBoundary>
        }
      />
      <ValidatorUnstakeDialog
        accountAddress={props.stake.controllerId?.toString() ?? props.account.address}
        open={isUnstakeDialogOpen}
        onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
      />
      <FastUnstakeDialog
        open={isFastUnstakeDialogOpen}
        fastUnstakeEligibility={useMemo(() => {
          switch (props.eligibleForFastUnstake) {
            case undefined:
              return 'pending'
            case true:
              return hasEnoughDepositForFastUnstake ? 'eligible' : 'insufficient-balance-for-deposit'
            case false:
              return 'ineligible'
          }
        }, [hasEnoughDepositForFastUnstake, props.eligibleForFastUnstake])}
        amount={amount.decimalAmount?.toLocaleString() ?? '...'}
        fiatAmount={amount.localizedFiatAmount ?? '...'}
        lockDuration={lockDuration}
        depositAmount={decimal?.fromPlanckOrUndefined(props.fastUnstakeDeposit?.toString())?.toLocaleString()}
        onDismiss={() => {
          setIsFastUnstakeDialogOpen(false)
        }}
        onSkip={() => {
          setIsFastUnstakeDialogOpen(false)
          setIsUnstakeDialogOpen(true)
        }}
        onConfirm={() => {
          if (props.eligibleForFastUnstake && hasEnoughDepositForFastUnstake) {
            void fastUnstake.signAndSend(props.account.address)
            setIsFastUnstakeDialogOpen(false)
          } else {
            setIsFastUnstakeDialogOpen(false)
            setIsUnstakeDialogOpen(true)
          }
        }}
        learnMoreHref="https://wiki.polkadot.network/docs/learn-staking#fast-unstake"
      />
    </>
  )
}

export default ValidatorStakeItem
