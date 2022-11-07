import Button from '@components/atoms/Button'
import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import Text from '@components/atoms/Text'
import HiddenDetails from '@components/molecules/HiddenDetails'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { Option, UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  constSelector,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  waitForAll,
} from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import { allPendingPoolRewardsState, eraStakersState } from '../../domains/nominationPools/recoils'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolStakeItem = ({
  item,
}: {
  item: {
    status?: PoolStatus
    account?: {
      address: string
      name?: string
    }
    poolName?: ReactNode
    poolMember: Option<PalletNominationPoolsPoolMember>
    pendingRewards?: UInt
  }
}) => {
  const [decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  return (
    <>
      <PoolStake
        poolStatus={item.status}
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={decimalFromAtomics.fromAtomics(item.poolMember.unwrapOrDefault().points).toHuman()}
        stakingAmountInFiat={(
          decimalFromAtomics.fromAtomics(item.poolMember.unwrapOrDefault().points).toNumber() * nativeTokenPrice
        ).toLocaleString(undefined, { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' })}
        rewardsAmount={'+' + decimalFromAtomics.fromAtomics(item.pendingRewards?.toString()).toHuman()}
        rewardsAmountInFiat={
          '+' +
          (decimalFromAtomics.fromAtomics(item.pendingRewards).toNumber() * nativeTokenPrice).toLocaleString(
            undefined,
            { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' }
          )
        }
        poolName={item.poolName ?? ''}
        onRequestClaim={() => claimPayoutExtrinsic.signAndSend(item.account?.address ?? '')}
        claimState={
          item.pendingRewards?.isZero() ?? true
            ? 'unavailable'
            : claimPayoutExtrinsic.state === 'loading'
            ? 'pending'
            : undefined
        }
        onRequestUnstake={() => setIsUnstaking(true)}
        onRequestAdd={() => setIsAddingStake(true)}
      />
      <AddStakeDialog
        account={isAddingStake ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsAddingStake(false), [])}
      />
      <UnstakeDialog
        account={isUnstaking ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsUnstaking(false), [])}
      />
    </>
  )
}

const Stakings = () => {
  const [api, pendingRewards, accounts] = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(
    waitForAll([apiState, allPendingPoolRewardsState, selectedPolkadotAccountsState])
  )

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators.multi',
    poolMembersLoadable.valueMaybe()?.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const poolMetadatumLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    poolMembersLoadable.valueMaybe()?.map(x => x.unwrapOrDefault().poolId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])

  const eraStakersLoadable = useRecoilValueLoadable(
    activeEraLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : eraStakersState(activeEraLoadable.contents.unwrapOrDefault().index)
  )

  const eraStakers = useMemo(
    () => new Set(eraStakersLoadable.valueMaybe()?.map(x => x[0].args[1].toHuman())),
    [eraStakersLoadable]
  )

  const pools = useMemo(
    () =>
      poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents
            .map((poolMember, index) => {
              const status: PoolStatus | undefined = (() => {
                if (poolNominatorsLoadable.state !== 'hasValue' || eraStakers === undefined) {
                  return undefined
                }

                const targets = poolNominatorsLoadable.contents[index]?.unwrapOrDefault().targets

                if (targets?.length === 0) return 'not_nominating'

                return targets?.some(x => eraStakers.has(x.toHuman())) ? 'earning_rewards' : 'waiting'
              })()

              return {
                status,
                account: accounts[index],
                poolName: poolMetadatumLoadable.valueMaybe()?.[index]?.toUtf8() ?? (
                  <CircularProgressIndicator size="1em" />
                ),
                poolMember,
                pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
              }
            })
            .filter(x => x.poolMember.isSome && !x.poolMember.unwrapOrDefault().points.isZero()),
    [
      poolMembersLoadable.state,
      poolMembersLoadable.contents,
      poolNominatorsLoadable,
      accounts,
      poolMetadatumLoadable,
      pendingRewards,
      eraStakers,
    ]
  )

  const [unstakeAccount, setUnstakeAccount] = useState<string>()
  const [addStakeAccount, setAddStakeAccount] = useState<string>()

  return (
    <div>
      <AddStakeDialog account={addStakeAccount} onDismiss={useCallback(() => setAddStakeAccount(undefined), [])} />
      <UnstakeDialog account={unstakeAccount} onDismiss={useCallback(() => setUnstakeAccount(undefined), [])} />
      <header>
        <Text.H4 css={{ marginBottom: '2.4rem' }}>Staking</Text.H4>
      </header>
      {poolMembersLoadable.valueMaybe()?.every(pool => pool.isNone) && pools?.length === 0 && (
        <HiddenDetails
          hidden
          overlay={
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3.2rem',
              }}
            >
              <Text.Body>You have no staked assets yet...</Text.Body>
              <Button as={Link} variant="outlined" to="/staking">
                Get started
              </Button>
            </div>
          }
        >
          <PoolStakeList>
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
          </PoolStakeList>
        </HiddenDetails>
      )}
      <PoolStakeList>
        {pools?.map(pool => (
          <PoolStakeItem item={pool} />
        ))}
      </PoolStakeList>
    </div>
  )
}

export default Stakings
