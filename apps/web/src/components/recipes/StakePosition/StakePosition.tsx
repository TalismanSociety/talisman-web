import AccountIcon from '@components/molecules/AccountIcon'
import type { Account } from '@domains/accounts'
import { Clock, MoreHorizontal, ZapOff, ZapPlus } from '@talismn/icons'
import {
  Chip,
  CircularProgressIndicator,
  Hr,
  Menu,
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
import { createContext, type PropsWithChildren, type ReactNode } from 'react'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import StakePositionSkeleton from './StakePosition.skeleton'

export type StakePositionProps = {
  readonly?: boolean
  account: Account
  provider: ReactNode
  shortProvider?: ReactNode
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
  lockedButton?: ReactNode
  menuButton?: ReactNode
  claimButton?: ReactNode
  withdrawButton?: ReactNode
}

const StakePositionContext = createContext({ readonly: false })

const IncreaseStakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content={readonly ? 'Account is readonly' : 'Increase stake'}>
        <TonalIconButton {...props} disabled={readonly}>
          <ZapPlus />
        </TonalIconButton>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const UnstakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content={readonly ? 'Account is readonly' : 'Unstake'}>
        <SurfaceIconButton {...props} disabled={readonly}>
          <ZapOff />
        </SurfaceIconButton>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const MenuButton = Object.assign(
  (props: PropsWithChildren) => (
    <Menu>
      <Menu.Button>
        <SurfaceIconButton>
          <MoreHorizontal />
        </SurfaceIconButton>
      </Menu.Button>
      <Menu.Items>{props.children}</Menu.Items>
    </Menu>
  ),
  { Item: Menu.Item }
)

const ClaimButton = (props: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <Chip {...props} disabled={readonly} css={{ '@container (min-width: 100rem)': { height: '4rem' } }}>
          Claim {props.amount}
        </Chip>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const WithdrawButton = (props: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <SurfaceChip {...props} disabled={readonly} css={{ '@container (min-width: 100rem)': { height: '4rem' } }}>
          Withdraw {props.amount}
        </SurfaceChip>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const LockedButton = (props: Omit<ChipProps, 'children'> & { amount: ReactNode }) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <Chip {...props} disabled={readonly} css={{ '@container (min-width: 100rem)': { height: '4rem' } }}>
          {props.amount} locked
        </Chip>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
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
    disabled={props.unlocks.length === 0}
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
      'gridTemplateColumns': 'repeat(2, minmax(0, 1fr)) min-content',
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
      <StakePositionContext.Provider value={{ readonly: props.readonly ?? false }}>
        <div css={{ containerType: 'inline-size' }}>
          <Grid>
            <div css={{ gridArea: 'account', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AccountIcon account={props.account} size="3.5rem" />
              <div css={{ overflow: 'hidden' }}>
                <Text.Body alpha="high" css={{ paddingRight: '1.6rem' }}>
                  {props.account.name ?? shortenAddress(props.account.address)}
                </Text.Body>
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingRight: '1.6rem' }}>
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
                      {props.shortProvider === undefined ? (
                        props.provider
                      ) : (
                        <>
                          <div css={{ 'display': 'none', '@container (min-width: 50rem)': { display: 'contents' } }}>
                            {props.provider}
                          </div>
                          <div css={{ 'display': 'contents', '@container (min-width: 50rem)': { display: 'none' } }}>
                            {props.shortProvider}
                          </div>
                        </>
                      )}
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
              {props.increaseStakeButton}
              {props.unstakeButton}
              {props.menuButton}
            </div>
            <div
              css={{ 'gridArea': 'asset', 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
            >
              <Text.BodySmall as="div" alpha="high">
                {props.symbol}
              </Text.BodySmall>
              <Text.Body as="div">{props.chain}</Text.Body>
            </div>
            <Surface
              css={{
                'gridArea': 'divider',
                'height': 1,
                '@container (min-width: 100rem)': { display: 'none' },
              }}
            />
            <div css={{ 'gridArea': 'balance', '@container (min-width: 100rem)': { textAlign: 'end' } }}>
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
              {props.lockedButton}
              {props.claimButton}
              {props.withdrawButton}
            </div>
          </Grid>
        </div>
      </StakePositionContext.Provider>
    )
  },
  {
    IncreaseStakeButton,
    UnstakeButton,
    MenuButton,
    ClaimButton,
    WithdrawButton,
    LockedButton,
    UnstakingStatus,
    FastUnstakingStatus,
    Skeleton: StakePositionSkeleton,
  }
)

export const StakePositionList = (props: PropsWithChildren<{ className?: string }>) => (
  <section {...props}>
    <div css={{ containerType: 'inline-size' }}>
      <header
        css={{
          'display': 'none',
          'marginBottom': '1.2rem',
          '@container (min-width: 100rem)': { display: 'revert' },
        }}
      >
        <Grid css={{ backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 }}>
          <Text.BodySmall css={{ gridArea: 'account' }}>Account</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'asset' }}>Asset</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'balance', textAlign: 'end' }}>Staking balance</Text.BodySmall>
        </Grid>
      </header>
    </div>
    <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</div>
  </section>
)

export default StakePosition
