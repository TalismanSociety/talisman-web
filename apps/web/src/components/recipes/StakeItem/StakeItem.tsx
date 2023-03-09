import { useTheme } from '@emotion/react'
import { Clock, Lock, Rocket } from '@talismn/icons'
import { Chip, ChipProps, Hr, Identicon, ListItem, Text, Tooltip } from '@talismn/ui'
import Color from 'colorjs.io'
import { ReactNode, useMemo } from 'react'

import { PoolStatus, PoolStatusIndicator } from '../PoolStatusIndicator'
import StakeItemSkeleton from './StakeItemSkeleton'

export type StakeItemProps = {
  accountName: string
  accountAddress: string
  stakingAmount: string
  stakingFiatAmount: string
  poolName: ReactNode
  poolStatus?: PoolStatus
  actions?: ReactNode
  status?: ReactNode
  readonly?: boolean
}

export const IncreaseStakeChip = (props: Omit<ChipProps, 'children'>) => (
  <Chip {...props} css={{ textTransform: 'capitalize' }}>
    <span css={{ '@media(max-width: 425px)': { display: 'none' } }}>Increase </span>stake
  </Chip>
)

export const UnstakeChip = (props: Omit<ChipProps, 'children'>) => <Chip {...props}>Unstake</Chip>

export const ClaimChip = ({ amount, ...props }: Omit<ChipProps, 'children'> & { amount: ReactNode }) => {
  const theme = useTheme()
  const claimChipContainerColor = useMemo(() => {
    const color = new Color(theme.color.primary)
    color.alpha = 0.125
    return color.display().toString()
  }, [theme.color.primary])
  return (
    <Chip {...props} containerColor={claimChipContainerColor} contentColor={theme.color.primary}>
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
          <>
            <Text.Body as="div" alpha="high">
              {x.amount}
            </Text.Body>
            <Text.Body as="div">{x.eta}</Text.Body>
            {index < array.length - 1 && <Hr />}
          </>
        ))}
      </div>
    }
  >
    {tooltipProps => (
      <div {...tooltipProps} css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        <Clock size="1em" />
        <Text.Body>Unstaking {props.amount}</Text.Body>
      </div>
    )}
  </Tooltip>
)

const StakeItem = Object.assign(
  (props: StakeItemProps) => {
    const theme = useTheme()

    return (
      <article css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
        <ListItem
          leadingContent={<Identicon value={props.accountAddress} size="4rem" />}
          headlineText={props.accountName}
          supportingText={
            <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
              <PoolStatusIndicator status={props.poolStatus} />
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
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: '0.8rem',
            padding: '0.8rem 1.6rem',
            backgroundColor: theme.color.foreground,
          }}
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
