import Button from '@components/atoms/Button'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import Tooltip from '@components/atoms/Tooltip'
import { useTheme } from '@emotion/react'
import React, { ReactElement, ReactNode } from 'react'
import { useMedia } from 'react-use'

import { PoolStatus, PoolStatusIndicator } from '../PoolStatusIndicator'
import PoolStakeSkeleton from './PoolStake.skeleton'

export type PoolStakeProps = {
  className?: string
  accountName: string
  accountAddress: string
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
  poolStatus?: PoolStatus
  variant?: 'compact'
}

const PoolStake = Object.assign(
  (props: PoolStakeProps) => {
    const theme = useTheme()
    const isWide = props.variant !== 'compact' && useMedia('(min-width: 1024px)')

    return (
      <article
        className={props.className}
        css={[
          {
            display: 'flex',
            flexDirection: 'column',
            padding: '1.6rem',
            borderRadius: '1.6rem',
            backgroundColor: theme.color.surface,
          },
          isWide && {
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        <Identicon
          value={props.accountAddress}
          size={40}
          css={{ display: props.variant === 'compact' ? 'none' : undefined }}
        />
        <dl
          css={[
            {
              'display': 'flex',
              'flexDirection': 'column',
              'gap': '2rem',
              '> div': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              'dd': {
                textAlign: 'right',
              },
            },
            isWide && {
              'flex': 1,
              'flexDirection': 'row',
              'alignItems': 'flex-start',
              'margin': 0,
              'overflow': 'hidden',
              'span': {
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              'dt': {
                display: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              },
              'dd': {
                'textAlign': 'left',
                'marginLeft': '2rem',
                'overflow': 'hidden',
                '> div': {
                  overflow: 'hidden',
                },
              },
              '> div': {
                flex: 1,
                overflow: 'hidden',
              },
              '> div:nth-child(2)': {
                flex: 2,
              },
            },
          ]}
        >
          {props.variant !== 'compact' && (
            <div>
              <dt>Account</dt>
              <dd>
                <div>
                  <Text.Body alpha="high">{props.accountName}</Text.Body>
                </div>
                <div>
                  <Text.Body>
                    ({props.accountAddress.slice(0, 4)}...{props.accountAddress.slice(-4)})
                  </Text.Body>
                </div>
              </dd>
            </div>
          )}
          <div css={isWide && { flex: 3 }}>
            <dt>Pool</dt>
            <dd
              css={!isWide && { maxWidth: '50%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            >
              <Text alpha="high" css={{ marginLeft: '0.8rem' }}>
                <PoolStatusIndicator
                  status={props.poolStatus}
                  css={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.6rem' }}
                />
                <Tooltip content={props.poolName}>
                  {tooltipProps => (
                    <div {...tooltipProps} css={{ display: 'inline' }}>
                      {props.poolName}
                    </div>
                  )}
                </Tooltip>
              </Text>
            </dd>
          </div>
          <div>
            <dt>Staking</dt>
            <dd>
              <div>
                <Text.Body alpha="high" css={{ fontWeight: 'bold' }}>
                  {props.stakingAmount}
                </Text.Body>
              </div>
              <div>
                <Text.Body>{props.stakingAmountInFiat}</Text.Body>
              </div>
            </dd>
          </div>
          <div>
            <dt>Rewards</dt>
            <dd>
              <div>
                <Text.Body alpha="high" css={{ fontWeight: 'bold' }}>
                  {props.rewardsAmount}
                </Text.Body>
              </div>
              <div>
                <Text.Body>{props.rewardsAmountInFiat}</Text.Body>
              </div>
            </dd>
          </div>
        </dl>
        <section
          css={[
            {
              'display': 'flex',
              'gap': '1rem',
              'marginTop': '2.5rem',
              '> *': {
                flex: 1,
              },
            },
            isWide && {
              marginTop: 0,
            },
          ]}
        >
          <Button
            variant="outlined"
            onClick={props.onRequestClaim}
            disabled={props.claimState === 'disabled' || props.claimState === 'unavailable'}
            loading={props.claimState === 'pending'}
            css={[
              props.claimState === 'unavailable' && { opacity: 0 },
              props.claimState === 'unavailable' && !isWide && { display: 'none' },
            ]}
          >
            Claim
          </Button>
          <Button
            variant="outlined"
            onClick={props.onRequestUnstake}
            disabled={props.unstakeState === 'disabled' || props.unstakeState === 'unavailable'}
            loading={props.unstakeState === 'pending'}
            css={[
              props.unstakeState === 'unavailable' && { opacity: 0 },
              props.unstakeState === 'unavailable' && !isWide && { display: 'none' },
            ]}
          >
            Unstake
          </Button>
          <Button
            variant="outlined"
            onClick={props.onRequestAdd}
            disabled={props.addState === 'disabled'}
            loading={props.addState === 'pending'}
          >
            Add
          </Button>
        </section>
      </article>
    )
  },
  { Skeleton: PoolStakeSkeleton }
)

export type PoolStakeListProps = {
  children?: ReactElement<PoolStakeProps> | ReactElement<PoolStakeProps>[]
}

export const PoolStakeList = (props: PoolStakeListProps) => {
  const theme = useTheme()
  return (
    <div>
      <div
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: React.Children.count(props.children) === 0 ? 'none' : 'flex',
            margin: '0 32.35rem 0.5rem 5.6rem',
          },
        }}
      >
        <Text.Body css={{ flex: 1, transform: 'translateX(-3.4rem)' }}>Account</Text.Body>
        <div css={{ flex: 2 }} />
        <Text.Body css={{ flex: 1 }}>
          <Text.Body css={{ paddingLeft: '2.4rem' }}>Staking</Text.Body>
        </Text.Body>
        <Text.Body css={{ flex: 1 }}>
          <Text.Body css={{ paddingLeft: '3.4rem' }}>Rewards</Text.Body>
        </Text.Body>
      </div>
      <ol
        css={{
          'listStyle': 'none',
          'margin': 0,
          'padding': 0,
          'li + li': {
            marginTop: '1.6rem',
          },
          '@media (min-width: 1024px)': {
            'background': theme.color.surface,
            'borderRadius': '1.6rem',
            'li + li': { marginTop: 0, borderTop: 'solid 1px #383838' },
            '> li:not(:first-child):not(:last-child) >:first-child': { borderRadius: 0 },
            '> li:first-child:not(:last-child) >:first-child': { borderEndStartRadius: 0, borderEndEndRadius: 0 },
            '> li:last-child:not(:first-child) >:first-child': { borderStartStartRadius: 0, borderStartEndRadius: 0 },
          },
        }}
      >
        {React.Children.map(props.children, child => child !== undefined && <li key={child.key}>{child}</li>)}
      </ol>
    </div>
  )
}

export default PoolStake
