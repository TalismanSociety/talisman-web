import { useTheme } from '@emotion/react'
import { Button, Identicon, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import React, { type ReactElement, type ReactNode } from 'react'

import StakeList from '../StakeList'
import ValidatorStakeSkeleton from './ValidatorStake.skeleton'

export type ValidatorStakeProps = {
  accountName: string
  accountAddress: string
  stakingAmount: string
  stakingAmountInFiat: string
  rewardsAmount: ReactNode
  rewardsAmountInFiat: string
  onRequestUnstake: () => unknown
  unstakeState?: 'unavailable' | 'pending' | 'disabled'
  notEarningRewards?: boolean
  readonly?: boolean
}

const ValidatorStake = Object.assign(
  (props: ValidatorStakeProps) => {
    const theme = useTheme()
    return (
      <article
        css={{
          'display': 'grid',
          'gridTemplateColumns': '1fr 1fr',
          'gridTemplateRows': 'auto',
          'gridTemplateAreas': `
            'account account'
            'sLabel  sValue'
            'rLabel  rValue'
            'uButton uButton'
          `,
          'gap': '1.6rem',
          'padding': '1.6rem',
          'borderRadius': '1.6rem',
          'backgroundColor': theme.color.surface,
          '@media (min-width: 1024px)': {
            gridTemplateColumns: '1.15fr 1.25fr 0.75fr min-content 0.25fr repeat(2, min-content) 0.95fr',
            gridTemplateAreas: `'account . rValue cButton . aButton uButton sValue'`,
            alignItems: 'center',
          },
        }}
      >
        <div css={{ display: 'flex', gap: '1rem', gridArea: 'account' }}>
          <Identicon value={props.accountAddress} size={40} />
          <div>
            <Text.Body as="div" alpha="high">
              {props.accountName}
            </Text.Body>
            <Text.Body as="div">({shortenAddress(props.accountAddress)})</Text.Body>
          </div>
        </div>
        <Text.Body as="div" css={{ 'gridArea': 'sLabel', '@media (min-width: 1024px)': { display: 'none' } }}>
          Staking
        </Text.Body>
        <div css={{ gridArea: 'sValue', justifySelf: 'end', textAlign: 'end' }}>
          <Text.Body as="div" alpha="high" css={{ fontWeight: 'bold' }}>
            {props.stakingAmount}
          </Text.Body>
          <Text.Body as="div">{props.stakingAmountInFiat}</Text.Body>
        </div>
        <Text.Body as="div" css={{ 'gridArea': 'rLabel', '@media (min-width: 1024px)': { display: 'none' } }}>
          Rewards
        </Text.Body>
        <div
          css={{
            gridArea: 'rValue',
            justifySelf: 'end',
            textAlign: 'end',
          }}
        >
          {props.notEarningRewards ? (
            <Text.Body
              alpha="high"
              css={{
                color: theme.color.onErrorContainer,
                backgroundColor: theme.color.errorContainer,
                padding: '1rem 1.3rem',
                borderRadius: '1.2rem',
              }}
            >
              You are not earning rewards
            </Text.Body>
          ) : (
            <>
              <Text.Body as="div" alpha="high" css={{ fontWeight: 'bold' }}>
                {props.rewardsAmount}
              </Text.Body>
              <Text.Body as="div">{props.rewardsAmountInFiat}</Text.Body>
            </>
          )}
        </div>
        <Button
          hidden={props.unstakeState === 'unavailable' || props.readonly}
          variant="outlined"
          onClick={props.onRequestUnstake}
          css={{ gridArea: 'uButton' }}
        >
          Unstake
        </Button>
        {/* Dummy buttons to align with nomination pool stake item */}
        <Button
          hidden
          variant="outlined"
          css={{ 'gridArea': 'aButton', 'display': 'none', '@media (min-width: 1024px)': { display: 'unset' } }}
        >
          Add
        </Button>
        <Button
          hidden
          variant="outlined"
          css={{ 'gridArea': 'cButton', 'display': 'none', '@media (min-width: 1024px)': { display: 'unset' } }}
        >
          Claim
        </Button>
        {/* End dummy buttons */}
      </article>
    )
  },
  { Skeleton: ValidatorStakeSkeleton }
)

export type ValidatorStakeListProps = {
  children?: ReactElement<ValidatorStakeProps> | Array<ReactElement<ValidatorStakeProps>>
}

export const ValidatorStakeList = (props: ValidatorStakeListProps) => (
  <div>
    <div
      css={{
        'display': 'none',
        '@media (min-width: 1024px)': {
          display: React.Children.count(props.children) === 0 ? 'none' : 'grid',
          gap: '1.6rem',
          gridTemplateColumns: '1.15fr 1.25fr 0.75fr min-content 0.25fr repeat(2, min-content) 0.95fr',
          gridTemplateAreas: `'account . rValue cButton . aButton uButton sValue'`,
          margin: '0.5rem 1rem',
        },
      }}
    >
      <Text.Body css={{ gridArea: 'account' }}>Validator staking</Text.Body>
      <Text.Body css={{ gridArea: 'rValue', justifySelf: 'end' }}>Last era rewards</Text.Body>
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

export default ValidatorStake
