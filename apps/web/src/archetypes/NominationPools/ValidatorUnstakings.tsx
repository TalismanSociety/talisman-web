import PoolUnstake, { ValidatorUnstakeList } from '@components/recipes/PoolUnstake'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { erasToMilliseconds } from '@domains/common/utils'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'

const ValidatorUnstakings = () => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')

  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  const [api, accounts, decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([apiState, selectedSubstrateAccountsState, nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const stakingsLoadable = useChainState('derive', 'staking', 'accounts', [
    accounts.map(({ address }) => address),
    undefined,
  ])

  const slashingSpansLoadable = useChainState(
    'query',
    'staking',
    'slashingSpans.multi',
    stakingsLoadable.valueMaybe()?.map(staking => staking.stashId) ?? []
  )

  if (stakingsLoadable.state !== 'hasValue' || slashingSpansLoadable.state !== 'hasValue') {
    return null
  }

  if (
    !stakingsLoadable.contents.some(
      staking => staking.redeemable?.isZero() === false || (staking.unlocking?.length ?? 0) > 0
    )
  ) {
    return null
  }

  return (
    <ValidatorUnstakeList>
      {stakingsLoadable.contents.flatMap((staking, sIndex) => {
        const commonProps = (amount: any) => ({
          accountName: accounts[sIndex]?.name ?? '',
          accountAddress: staking.accountId.toString(),
          unstakingAmount: decimal.fromPlanck(amount).toHuman(),
          unstakingFiatAmount: (decimal.fromPlanck(amount).toNumber() * nativeTokenPrice).toLocaleString(undefined, {
            style: 'currency',
            currency: 'usd',
            currencyDisplay: 'narrowSymbol',
          }),
          onRequestWithdraw: () =>
            withdrawExtrinsic.signAndSend(
              staking.controllerId ?? '',
              (slashingSpansLoadable.contents[sIndex]?.unwrapOrDefault().prior.length ?? -1) + 1
            ),
          withdrawState:
            withdrawExtrinsic.state === 'loading' && withdrawExtrinsic.parameters?.[0] === staking.controllerId
              ? withdrawExtrinsic.parameters?.[0] === staking.controllerId
                ? ('pending' as const)
                : ('disabled' as const)
              : undefined,
        })
        return [
          staking.redeemable?.isZero() === false && <PoolUnstake key={sIndex} {...commonProps(staking.redeemable)} />,
          ...(staking.unlocking?.flatMap((unlock, uIndex) => (
            <PoolUnstake
              key={`${sIndex}:${uIndex}`}
              {...commonProps(unlock.value)}
              timeTilWithdrawable={formatDistanceToNow(
                addMilliseconds(
                  new Date(),
                  erasToMilliseconds(
                    unlock.remainingEras,
                    sessionProgressLoadable.contents.eraLength,
                    sessionProgressLoadable.contents.eraProgress,
                    api.consts.babe.expectedBlockTime
                  )
                )
              )}
              readonly={accounts[sIndex]?.readonly}
            />
          )) ?? []),
        ]
      })}
    </ValidatorUnstakeList>
  )
}

export default ValidatorUnstakings
