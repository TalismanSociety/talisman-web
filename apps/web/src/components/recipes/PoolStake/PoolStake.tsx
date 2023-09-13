import { useTheme } from '@emotion/react'
import { Button, Text, Tooltip } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import React, { useMemo, type ReactElement, type ReactNode } from 'react'
import { useMedia } from 'react-use'

import AccountIcon from '@components/molecules/AccountIcon'
import type { Account } from '@domains/accounts'
import StakeList from '../StakeList'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import PoolStakeSkeleton from './PoolStake.skeleton'

export type PoolStakeProps = {
  className?: string
  account: Account
  stakingAmount: string
  stakingAmountInFiat: string
  rewardsAmount: string
  rewardsAmountInFiat: string
  poolName: ReactNode
  onRequestClaim: () => unknown
  onRequestUnstake: () => unknown
  onRequestAdd: () => unknown
  claimState?: 'unavailable' | 'pending' | 'disabled'
  addState?: 'pending' | 'disabled'
  unstakeState?: 'unavailable' | 'pending' | 'disabled'
  poolStatus?: StakeStatus
  variant?: 'compact'
  readonly?: boolean
}

const PoolStake = Object.assign(
  (props: PoolStakeProps) => {
    const theme = useTheme()
    const isWide = props.variant !== 'compact' && useMedia('(min-width: 1024px)')

    const buttonsRowArea = useMemo(() => {
      if (props.claimState === 'unavailable' && props.unstakeState === 'unavailable') {
        return `'aButton aButton aButton aButton aButton aButton'`
      }

      if (props.claimState === 'unavailable') {
        return `'uButton uButton uButton aButton aButton aButton'`
      }

      if (props.unstakeState === 'unavailable') {
        return `'cButton cButton cButton aButton aButton aButton'`
      }

      return `'cButton cButton uButton uButton aButton aButton'`
    }, [props.claimState, props.unstakeState])

    return (
      <article
        className={props.className}
        css={[
          {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateAreas: `
              'account account account account account account'
              'pLabel pLabel pLabel pValue pValue pValue'
              'rLabel rLabel rLabel rValue rValue rValue'
              'sLabel sLabel sLabel sValue sValue sValue'
              ${buttonsRowArea}
          `,
            alignItems: 'center',
            gap: '1.6rem',
            padding: '1.6rem',
            borderRadius: '1.6rem',
            backgroundColor: theme.color.surface,
          },
          isWide && {
            gridTemplateColumns: '1.15fr 1.25fr 0.75fr min-content 0.25fr repeat(2, min-content) 0.95fr',
            gridTemplateAreas: `'account pValue rValue cButton . aButton uButton sValue'`,
            alignItems: 'initial',
          },
        ]}
      >
        {props.variant !== 'compact' && (
          <div css={{ display: 'flex', gap: '1rem', gridArea: 'account' }}>
            <AccountIcon account={props.account} size={40} />
            <div>
              <Text.Body as="div" alpha="high">
                {props.account.name}
              </Text.Body>
              <Text.Body as="div">({shortenAddress(props.account.address)})</Text.Body>
            </div>
          </div>
        )}
        <Text.Body as="div" css={[{ gridArea: 'pLabel' }, isWide && { display: 'none' }]}>
          Pool
        </Text.Body>
        <div
          css={[
            {
              maxWidth: '100%',
              gridArea: 'pValue',
              justifySelf: 'end',
              textAlign: 'end',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
            isWide && { justifySelf: 'start' },
          ]}
        >
          <Text alpha="high" css={{ marginLeft: '0.8rem' }}>
            <StakeStatusIndicator
              status={props.poolStatus}
              css={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.6rem' }}
            />
            <Tooltip content={props.poolName}>
              <div css={{ display: 'inline' }}>{props.poolName}</div>
            </Tooltip>
          </Text>
        </div>
        <Text.Body as="div" css={[{ gridArea: 'sLabel' }, isWide && { display: 'none' }]}>
          Staking
        </Text.Body>
        <div css={{ gridArea: 'sValue', justifySelf: 'end', textAlign: 'end' }}>
          <div>
            <Text.Body alpha="high" css={{ fontWeight: 'bold' }}>
              {props.stakingAmount}
            </Text.Body>
          </div>
          <div>
            <Text.Body>{props.stakingAmountInFiat}</Text.Body>
          </div>
        </div>
        <Text.Body as="div" css={[{ gridArea: 'rLabel' }, isWide && { display: 'none' }]}>
          Rewards
        </Text.Body>
        <div css={{ gridArea: 'rValue', justifySelf: 'end', textAlign: 'end' }}>
          <div>
            <Text.Body alpha="high" css={{ fontWeight: 'bold' }}>
              {props.rewardsAmount}
            </Text.Body>
          </div>
          <div>
            <Text.Body>{props.rewardsAmountInFiat}</Text.Body>
          </div>
        </div>
        <Button
          variant="outlined"
          onClick={props.onRequestClaim}
          hidden={props.claimState === 'unavailable' || props.readonly}
          disabled={props.claimState === 'disabled' || props.claimState === 'unavailable'}
          loading={props.claimState === 'pending'}
          css={[{ gridArea: 'cButton' }, props.claimState === 'unavailable' && !isWide && { display: 'none' }]}
        >
          Claim
        </Button>
        <Button
          variant="outlined"
          onClick={props.onRequestUnstake}
          hidden={props.unstakeState === 'unavailable' || props.readonly}
          disabled={props.unstakeState === 'disabled' || props.unstakeState === 'unavailable'}
          loading={props.unstakeState === 'pending'}
          css={[{ gridArea: 'uButton' }, props.unstakeState === 'unavailable' && !isWide && { display: 'none' }]}
        >
          Unstake
        </Button>
        <Button
          variant="outlined"
          onClick={props.onRequestAdd}
          hidden={props.readonly}
          disabled={props.addState === 'disabled'}
          loading={props.addState === 'pending'}
          css={{ gridArea: 'aButton' }}
        >
          Add
        </Button>
      </article>
    )
  },
  { Skeleton: PoolStakeSkeleton }
)

export type PoolStakeListProps = {
  children?: ReactElement<PoolStakeProps> | Array<ReactElement<PoolStakeProps>>
}

export const PoolStakeList = (props: PoolStakeListProps) => (
  <div>
    <div
      css={{
        'display': 'none',
        '@media (min-width: 1024px)': {
          display: React.Children.count(props.children) === 0 ? 'none' : 'grid',
          gridTemplateColumns: '1.15fr 1.25fr 0.75fr min-content 0.25fr repeat(2, min-content) 0.95fr',
          gridTemplateAreas: `'account pValue rValue cButton . aButton uButton sValue'`,
          gap: '1.6rem',
          margin: '0.5rem 1rem',
        },
      }}
    >
      <Text.Body css={{ gridArea: 'account' }}>Nomination pool staking</Text.Body>
      <Text.Body css={{ gridArea: 'pValue' }}>Nomination pool</Text.Body>
      <Text.Body css={{ gridArea: 'rValue', textAlign: 'end' }}>Rewards</Text.Body>
      <Text.Body css={{ gridArea: 'sValue', textAlign: 'end' }}>Staked amount</Text.Body>
      {/* TODO: Dummy buttons to align with nomination pool stake item */}
      {/* Find a better way to achieve alignment */}
      <div
        css={{
          'gridArea': 'aButton',
          'height': 0,
          'display': 'none',
          '@media (min-width: 1024px)': { display: 'unset' },
        }}
      >
        <Button hidden variant="outlined">
          Add
        </Button>
      </div>
      <div
        css={{
          'gridArea': 'cButton',
          'height': 0,
          'display': 'none',
          '@media (min-width: 1024px)': { display: 'unset' },
        }}
      >
        <Button hidden variant="outlined">
          Claim
        </Button>
      </div>
      <div
        css={{
          'gridArea': 'uButton',
          'height': 0,
          'display': 'none',
          '@media (min-width: 1024px)': { display: 'unset' },
        }}
      >
        <Button hidden variant="outlined">
          Unstake
        </Button>
      </div>
      {/* End dummy buttons */}
    </div>
    <StakeList>
      {React.Children.map(props.children, child => child !== undefined && <li key={child.key}>{child}</li>)}
    </StakeList>
  </div>
)

export default PoolStake
