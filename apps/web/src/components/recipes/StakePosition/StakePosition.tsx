import AccountIcon from '@components/molecules/AccountIcon'
import type { Account } from '@domains/accounts'
import { BarChart2, Clock, Zap, ZapOff } from '@talismn/icons'
import {
  Chip,
  CircularProgressIndicator,
  Hr,
  Surface,
  SurfaceChip,
  SurfaceIconButton,
  Text,
  TonalIconButton,
  Tooltip,
  type ButtonProps,
  type ChipProps,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import type { PropsWithChildren, ReactNode } from 'react'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import StakePositionSkeleton from './StakePosition.skeleton'

export type StakePositionProps = {
  readonly?: boolean
  account: Account
  provider: ReactNode
  stakeStatus: StakeStatus
  symbol: ReactNode
  chain: ReactNode
  balance: ReactNode
  fiatBalance: ReactNode
  rewards?: ReactNode
  fiatRewards?: ReactNode
  status?: ReactNode
  increaseStakeButton?: ReactNode
  unstakeButton?: ReactNode
  statisticsButton?: ReactNode
  claimButton?: ReactNode
  withdrawButton?: ReactNode
}

const IncreaseStakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <Tooltip content="Increase stake">
    <TonalIconButton {...props}>
      <Zap />
    </TonalIconButton>
  </Tooltip>
)

const UnstakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <Tooltip content="Unstake">
    <SurfaceIconButton {...props}>
      <ZapOff />
    </SurfaceIconButton>
  </Tooltip>
)

const StatisticsButton = (props: Omit<ButtonProps, 'children'>) => (
  <Tooltip content="Statistics">
    <SurfaceIconButton {...props}>
      <BarChart2 />
    </SurfaceIconButton>
  </Tooltip>
)

const ClaimButton = (props: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <Chip {...props} css={{ '@container (min-width: 100rem)': { height: '4rem' } }}>
    Claim {props.amount}
  </Chip>
)

const WithdrawButton = (props: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <SurfaceChip {...props} css={{ '@container (min-width: 100rem)': { height: '4rem' } }}>
    Withdraw {props.amount}
  </SurfaceChip>
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

const Grid = (props: PropsWithChildren<{ className?: string }>) => (
  <Surface
    as="article"
    css={{
      'borderRadius': '0.8rem',
      'padding': '0.8rem 1.2rem',
      'display': 'grid',
      'gridTemplateAreas': `
        'account account quick-actions'
        'divider divider divider'
        'balance actions actions'
      `,
      'gap': '0.6rem',
      '@container (min-width: 100rem)': {
        alignItems: 'center',
        gridTemplateAreas: `'account asset balance actions quick-actions'`,
        gridTemplateColumns: '25rem 10rem 20rem 1fr min-content',
      },
    }}
    {...props}
  />
)

const StakePosition = Object.assign(
  (props: StakePositionProps) => {
    return (
      <div css={{ containerType: 'inline-size' }}>
        <Grid>
          <div css={{ gridArea: 'account', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AccountIcon account={props.account} size="3.5rem" />
            <div css={{ overflow: 'hidden' }}>
              <Text.Body alpha="high">{props.account.name ?? shortenAddress(props.account.address)}</Text.Body>
              <div css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <StakeStatusIndicator status={props.stakeStatus} />
                <Tooltip content={props.provider}>
                  <Text.BodySmall
                    css={{
                      'overflow': 'hidden',
                      'textOverflow': 'ellipsis',
                      '@container (min-width: 100rem)': {
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    {props.provider}
                  </Text.BodySmall>
                </Tooltip>
              </div>
            </div>
          </div>
          <div
            css={{
              gridArea: 'quick-actions',
              justifySelf: 'end',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
            }}
          >
            {!props.readonly && props.increaseStakeButton}
            {!props.readonly && props.unstakeButton}
            {props.statisticsButton}
          </div>
          <div
            css={{ 'gridArea': 'asset', 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
          >
            <Text.BodySmall as="div">{props.symbol}</Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.chain}
            </Text.Body>
          </div>
          <Surface
            css={{
              'gridArea': 'divider',
              'height': 1,
              '@container (min-width: 100rem)': { display: 'none' },
            }}
          />
          <div css={{ gridArea: 'balance' }}>
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Total staked
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.balance}
            </Text.Body>
            <Text.BodySmall
              as="div"
              css={{ 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
            >
              {props.fiatBalance}
            </Text.BodySmall>
          </div>
          <div
            css={{
              gridArea: 'actions',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.8rem',
              flexWrap: 'wrap',
            }}
          >
            {props.status}
            {!props.readonly && props.claimButton}
            {!props.readonly && props.withdrawButton}
          </div>
        </Grid>
      </div>
    )
  },
  {
    IncreaseStakeButton,
    UnstakeButton,
    StatisticsButton,
    ClaimButton,
    WithdrawButton,
    UnstakingStatus,
    FastUnstakingStatus,
    Skeleton: StakePositionSkeleton,
  }
)

export const StakePositionList = (props: PropsWithChildren<{ className?: string }>) => (
  <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }} {...props}>
    <div css={{ containerType: 'inline-size' }}>
      <header
        css={{
          'display': 'none',
          'marginBottom': '0.2rem',
          '@container (min-width: 100rem)': { display: 'revert' },
        }}
      >
        <Grid css={{ backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 }}>
          <Text.BodySmall css={{ gridArea: 'account' }}>Account</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'asset' }}>Asset</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'balance' }}>Staked balance</Text.BodySmall>
        </Grid>
      </header>
    </div>
    {props.children}
  </section>
)

export default StakePosition
