import { type DeriveStakingAccount } from '@polkadot/api-derive/types'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import BN from 'bn.js'
import { useMemo, useState } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import { FastUnstakeDialog } from '@/components/recipes/FastUnstakeDialog'
import { StakePosition } from '@/components/recipes/StakePosition'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { type Account } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@/domains/chains/recoils'
import { useEraEtaFormatter } from '@/domains/common/hooks/useEraEta'
import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useNativeTokenLocalizedFiatAmount } from '@/domains/common/hooks/useLocalizedFiatAmount'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { useLocalizedUnlockDuration } from '@/domains/staking/substrate/nominationPools/hooks'
import { useTotalValidatorStakingRewards } from '@/domains/staking/substrate/validator/hooks'

import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const TotalRewards = ({ account }: { account: Account }) => {
  const { totalRewards, isError } = useTotalValidatorStakingRewards(account)
  if (isError) return '--'

  return totalRewards.toLocaleString()
}

const TotalFiatRewards = ({ account }: { account: Account }) => {
  const { totalRewards, isError } = useTotalValidatorStakingRewards(account)
  const totalFiatRewards = useNativeTokenLocalizedFiatAmount(totalRewards)
  if (isError) return null

  return totalFiatRewards
}

const ValidatorStakeItem = ({
  account,
  stake,
  reward,
  slashingSpan,
  eligibleForFastUnstake,
  inFastUnstakeHead,
  inFastUnstakeQueue,
  fastUnstakeDeposit,
}: {
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
      useDeriveState('balances', 'all', [account.address]),
      useNativeTokenDecimalState(),
      useNativeTokenPriceState(),
    ])
  )

  const [chain, api, balances, decimal, nativeTokenPrice] = state === 'hasValue' ? contents : []

  const amount = useTokenAmountFromPlanck(
    inFastUnstakeQueue || inFastUnstakeHead ? stake.unlocking?.[0]?.value : stake.stakingLedger.active.unwrap()
  )

  const active = decimal?.fromPlanck(stake.stakingLedger.active.toBigInt())

  const totalUnlocking = useMemo(
    () => stake.unlocking?.reduce((previous, current) => previous.add(current.value), new BN(0)),
    [stake.unlocking]
  )

  const hasEnoughDepositForFastUnstake = useMemo(() => {
    if (!balances || !api) return false
    return balances.availableBalance.gte(api.consts.balances.existentialDeposit.add(fastUnstakeDeposit ?? new BN(0)))
  }, [api, balances, fastUnstakeDeposit])

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = stake.unlocking?.map(x => ({
    amount: decimal?.fromPlanck(x.value.toBigInt()).toLocaleString(),
    eta: eraEtaFormatter(x.remainingEras) ?? <CircularProgressIndicator size="1em" />,
  }))

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  const onRequestUnstake = () => {
    if (eligibleForFastUnstake || eligibleForFastUnstake === undefined) {
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
        stakeStatus={reward === undefined ? undefined : reward === 0n ? 'not_earning_rewards' : 'earning_rewards'}
        readonly={account.readonly}
        account={account}
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
            <TotalRewards account={account} />
          </ErrorBoundary>
        }
        fiatRewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <TotalFiatRewards account={account} />
          </ErrorBoundary>
        }
        unstakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.UnstakeButton onClick={onRequestUnstake} />
          </ErrorBoundary>
        }
        withdrawButton={
          stake.redeemable?.isZero() === false && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.WithdrawButton
                amount={
                  <RedactableBalance>
                    {decimal?.fromPlanck(stake.redeemable.toBigInt()).toLocaleString()}
                  </RedactableBalance>
                }
                onClick={() => {
                  void withdrawExtrinsic.signAndSend(stake.controllerId ?? '', slashingSpan)
                }}
                loading={withdrawExtrinsic.state === 'loading'}
              />
            </ErrorBoundary>
          )
        }
        unstakingStatus={
          <ErrorBoundary renderFallback={() => <>--</>}>
            {totalUnlocking?.isZero() === false ? (
              inFastUnstakeHead || inFastUnstakeQueue ? (
                <StakePosition.FastUnstakingStatus
                  amount={
                    <RedactableBalance>
                      {decimal?.fromPlanck(totalUnlocking.toString()).toLocaleString()}
                    </RedactableBalance>
                  }
                  status={inFastUnstakeHead ? 'in-head' : inFastUnstakeQueue ? 'in-queue' : undefined}
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
        accountAddress={stake.controllerId?.toString() ?? account.address}
        open={isUnstakeDialogOpen}
        onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
      />
      <FastUnstakeDialog
        open={isFastUnstakeDialogOpen}
        fastUnstakeEligibility={useMemo(() => {
          switch (eligibleForFastUnstake) {
            case undefined:
              return 'pending'
            case true:
              return hasEnoughDepositForFastUnstake ? 'eligible' : 'insufficient-balance-for-deposit'
            case false:
              return 'ineligible'
          }
        }, [hasEnoughDepositForFastUnstake, eligibleForFastUnstake])}
        amount={amount.decimalAmount?.toLocaleString() ?? '...'}
        fiatAmount={amount.localizedFiatAmount ?? '...'}
        lockDuration={lockDuration}
        depositAmount={decimal?.fromPlanckOrUndefined(fastUnstakeDeposit?.toString())?.toLocaleString()}
        onDismiss={() => {
          setIsFastUnstakeDialogOpen(false)
        }}
        onSkip={() => {
          setIsFastUnstakeDialogOpen(false)
          setIsUnstakeDialogOpen(true)
        }}
        onConfirm={() => {
          if (eligibleForFastUnstake && hasEnoughDepositForFastUnstake) {
            void fastUnstake.signAndSend(account.address)
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
