import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import HiddenDetails from '@components/molecules/HiddenDetails'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { Option, UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import { allPendingPoolRewardsState } from '../../domains/nominationPools/recoils'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolStakeItem = ({
  item,
}: {
  item: {
    account?: {
      address: string
      name?: string
    }
    poolName?: string
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
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={decimalFromAtomics.fromAtomics(item.poolMember.unwrapOrDefault().points).toHuman()}
        stakingAmountInFiat={(
          decimalFromAtomics.fromAtomics(item.poolMember.unwrapOrDefault().points).toFloatApproximation() *
          nativeTokenPrice
        ).toLocaleString(undefined, { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' })}
        rewardsAmount={decimalFromAtomics.fromAtomics(item.pendingRewards?.toString()).toHuman()}
        rewardsAmountInFiat={(
          decimalFromAtomics.fromAtomics(item.pendingRewards).toFloatApproximation() * nativeTokenPrice
        ).toLocaleString(undefined, { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' })}
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
  const [pendingRewards, accounts] = useRecoilValue(
    waitForAll([allPendingPoolRewardsState, selectedPolkadotAccountsState])
  )

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const poolMetadatumLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    poolMembersLoadable.valueMaybe()?.map(x => x.unwrapOrDefault().poolId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const pools = useMemo(
    () =>
      poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents
            .map((poolMember, index) => {
              return {
                account: accounts[index],
                poolName: poolMetadatumLoadable.valueMaybe()?.[index]?.toUtf8(),
                poolMember,
                pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
              }
            })
            .filter(x => x.poolMember.isSome && !x.poolMember.unwrapOrDefault().points.isZero()),
    [poolMembersLoadable.state, poolMembersLoadable.contents, accounts, poolMetadatumLoadable, pendingRewards]
  )

  const [unstakeAccount, setUnstakeAccount] = useState<string>()
  const [addStakeAccount, setAddStakeAccount] = useState<string>()

  return (
    <div>
      <AddStakeDialog account={addStakeAccount} onDismiss={useCallback(() => setAddStakeAccount(undefined), [])} />
      <UnstakeDialog account={unstakeAccount} onDismiss={useCallback(() => setUnstakeAccount(undefined), [])} />
      <header>
        <Text.H4>Staking</Text.H4>
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
