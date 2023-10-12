import { useTheme } from '@emotion/react'
import { Clock, Lock, Rocket } from '@talismn/icons'

import { Chip, CircularProgressIndicator, Hr, ListItem, Text, Tooltip, type ChipProps } from '@talismn/ui'
import { Fragment, type ReactNode } from 'react'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import StakeItemSkeleton from './StakeItemSkeleton'
import type { Account } from '@domains/accounts'
import { shortenAddress } from '@util/format'
import AccountIcon from '@components/molecules/AccountIcon'

export type StakeItemProps = {
  account: Account
  stakingAmount: ReactNode
  stakingFiatAmount: ReactNode
  poolName: ReactNode
  stakeStatus?: StakeStatus
  actions?: ReactNode
  status?: ReactNode
  readonly?: boolean
  hideIdenticon?: boolean
}

export const IncreaseStakeChip = (props: Omit<ChipProps, 'children'>) => (
  <Chip {...props} css={{ textTransform: 'capitalize' }}>
    <span css={{ '@media(max-width: 425px)': { display: 'none' } }}>Increase </span>stake
  </Chip>
)

export const UnstakeChip = (props: Omit<ChipProps, 'children'>) => <Chip {...props}>Unstake</Chip>

export const ClaimChip = ({ amount, ...props }: Omit<ChipProps, 'children'> & { amount: ReactNode }) => {
  const theme = useTheme()
  return (
    <Chip
      {...props}
      containerColor={`color-mix(in srgb, ${theme.color.primary}, transparent 88%)`}
      contentColor={theme.color.primary}
    >
      Claim {amount}
    </Chip>
  )
}

export const WithdrawChip = ({ amount, ...props }: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <Chip {...props}>Withdraw {amount}</Chip>
)

export const FastUnstakeChip = (props: Omit<ChipProps, 'children'>) => (
  <Chip {...props} leadingContent={<Rocket size="1em" />}>
    Fast unstake
  </Chip>
)

export const UnstakingStatus = (props: {
  amount: ReactNode
  unlocks: Array<{ amount: ReactNode; eta: ReactNode }>
}) => (
  <Tooltip
    placement="bottom"
    content={
      <div>
        {props.unlocks.map((x, index, array) => (
          <Fragment key={index}>
            <Text.Body as="div" alpha="high">
              {x.amount}
            </Text.Body>
            <Text.Body as="div">{x.eta}</Text.Body>
            {index < array.length - 1 && <Hr />}
          </Fragment>
        ))}
      </div>
    }
  >
    <div css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
      <Clock size="1em" />
      <Text.Body>Unstaking {props.amount}</Text.Body>
    </div>
  </Tooltip>
)

export const FastUnstakingStatus = (props: { amount: ReactNode; status: 'in-head' | 'in-queue' | undefined }) => (
  <div css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
    <CircularProgressIndicator size="1em" />
    <Text.Body>Fast unstaking {props.amount}</Text.Body>
  </div>
)

const StakeItem = Object.assign(
  (props: StakeItemProps) => {
    const theme = useTheme()

    return (
      <article css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
        <ListItem
          leadingContent={!props.hideIdenticon && <AccountIcon account={props.account} size="4rem" />}
          headlineText={props.account.name ?? shortenAddress(props.account.address)}
          supportingText={
            <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
              <StakeStatusIndicator status={props.stakeStatus} />
              <Text.Body css={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {props.poolName}
              </Text.Body>
            </Text.Body>
          }
          trailingContent={
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text.BodyLarge as="div" css={{ fontWeight: 'bold' }}>
                {props.stakingAmount} <Lock size="1em" />
              </Text.BodyLarge>
              <Text.BodyLarge as="div">{props.stakingFiatAmount}</Text.BodyLarge>
            </div>
          }
          css={{ backgroundColor: theme.color.surface }}
        />
        <div
          css={[
            {
              display: 'flex',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.8rem',
              padding: '0.8rem 1.6rem',
              backgroundColor: theme.color.foreground,
            },
            (!props.actions || props.readonly) && !props.status && { display: 'none' },
          ]}
        >
          {!props.readonly && <div css={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>{props.actions}</div>}
          <Text.Body
            css={{
              flex: 1,
              justifyContent: 'flex-end',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25em',
              whiteSpace: 'nowrap',
            }}
          >
            {props.status}
          </Text.Body>
        </div>
      </article>
    )
  },
  { Skeleton: StakeItemSkeleton }
)

export default StakeItem
