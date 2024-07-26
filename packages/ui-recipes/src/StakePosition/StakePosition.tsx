import AccountIcon from '../AccountIcon'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import type { Account } from '../types'
import { shortenAddress } from '../utils'
import StakePositionSkeleton from './StakePosition.skeleton'
import {
  Badge,
  BadgedBox,
  CircularProgressIndicator,
  Hr,
  Menu,
  Surface,
  SurfaceButton,
  SurfaceIconButton,
  Text,
  TonalButton,
  TonalIconButton,
  Tooltip,
  useTheme,
  type ButtonProps,
  type IconButtonProps,
  type MenuItemProps,
} from '@talismn/ui'
import { ArrowDown, Clock, Earn, MoreHorizontal, ZapPlus } from '@talismn/web-icons'
import { Suspense, createContext, useContext, type PropsWithChildren, type ReactNode } from 'react'

const MEDIUM_CONTAINER_QUERY = '@container(min-width: 100rem)'

const LARGE_CONTAINER_QUERY = '@container(min-width: 120rem)'

export type StakePositionProps = {
  readonly?: boolean
  account: Account
  provider: ReactNode
  shortProvider?: ReactNode
  stakeStatus: StakeStatus
  assetSymbol: ReactNode
  assetLogoSrc: string
  chain: ReactNode
  balance: ReactNode
  fiatBalance: ReactNode
  rewards?: ReactNode
  fiatRewards?: ReactNode
  unstakingStatus?: ReactNode
  increaseStakeButton?: ReactNode
  unstakeButton?: ReactNode
  lockedButton?: ReactNode
  menuButton?: ReactNode
  claimButton?: ReactNode
  withdrawButton?: ReactNode
}

const StakePositionContext = createContext({ readonly: false })

const IncreaseStakeButton = (props: Omit<IconButtonProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content={readonly ? 'Account is readonly' : 'Increase stake'}>
        <TonalIconButton disabled={readonly} {...props}>
          <ZapPlus />
        </TonalIconButton>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const UnstakeButton = (props: Omit<MenuItemProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <Menu.Item.Button headlineContent="Unstake" disabled={readonly} {...props} />
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const MenuContext = createContext<{ attentionRequired: boolean; children: ReactNode }>({
  attentionRequired: false,
  children: null,
})

const MenuButton = Object.assign(
  (props: PropsWithChildren) => {
    const context = useContext(MenuContext)

    return (
      <Menu>
        <Menu.Button>
          <BadgedBox badge={context.attentionRequired && <Badge />} overlap="circular">
            <SurfaceIconButton>
              <MoreHorizontal />
            </SurfaceIconButton>
          </BadgedBox>
        </Menu.Button>
        <Menu.Items>
          {context.children}
          {props.children}
        </Menu.Items>
      </Menu>
    )
  },
  { Item: Menu.Item }
)

const ClaimButton = (props: Omit<ButtonProps, 'children'> & { amount: ReactNode }) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <TonalButton {...props} leadingIcon={<Earn />} disabled={readonly} css={{ width: '100%' }}>
          <span css={{ [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}>Claim </span>
          {props.amount}
        </TonalButton>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const WithdrawButton = (props: Omit<ButtonProps, 'children'> & { amount: ReactNode }) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => (
      <Tooltip content="Account is readonly" disabled={!readonly}>
        <SurfaceButton {...props} leadingIcon={<ArrowDown />} disabled={readonly} css={{ width: '100%' }}>
          <span css={{ [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}>Withdraw </span>
          {props.amount}
        </SurfaceButton>
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const LockedButton = (
  props: Omit<ButtonProps, 'children' | 'onClick'> & { amount: ReactNode; onClick: () => unknown }
) => {
  const theme = useTheme()
  return (
    <StakePositionContext.Consumer>
      {({ readonly }) => (
        <Tooltip content="Account is readonly" disabled={!readonly}>
          <Menu.Item.Button
            {...props}
            headlineContent={<span>{props.amount} locked</span>}
            trailingContent={<Badge containerColor={theme.color.primary} />}
            disabled={readonly}
          />
        </Tooltip>
      )}
    </StakePositionContext.Consumer>
  )
}

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
    <SurfaceButton leadingIcon={<Clock />} disabled css={{ width: '100%' }}>
      <span css={{ [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}>Unstaking </span>
      {props.amount}
    </SurfaceButton>
  </Tooltip>
)

export const FastUnstakingStatus = (props: { amount: ReactNode; status: 'in-head' | 'in-queue' | undefined }) => (
  <SurfaceButton leadingIcon={<CircularProgressIndicator />} disabled css={{ width: '100%' }}>
    <span css={{ [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}>Fast unstaking </span>
    {props.amount}
  </SurfaceButton>
)

const StakePosition = Object.assign(
  (props: StakePositionProps) => {
    const theme = useTheme()
    const shouldRenderMenuBtn = props.unstakeButton || props.lockedButton || props.menuButton
    return (
      <StakePositionContext.Provider value={{ readonly: props.readonly ?? false }}>
        <div css={{ containerType: 'inline-size' }}>
          <Surface
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              borderRadius: '1.6rem',
              padding: '1.6rem',
              [MEDIUM_CONTAINER_QUERY]: {
                flexDirection: 'row',
                alignItems: 'center',
              },
            }}
          >
            <div
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.8rem',
                [MEDIUM_CONTAINER_QUERY]: { display: 'contents' },
              }}
            >
              <Text.BodySmall
                as="header"
                css={{
                  [MEDIUM_CONTAINER_QUERY]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    width: '24rem',
                    fontSize: theme.typography.bodyLarge.fontSize,
                  },
                }}
              >
                <div
                  css={{
                    display: 'inline-block',
                    width: '1.2rem',
                    height: '1.2rem',
                    [MEDIUM_CONTAINER_QUERY]: { width: '4rem', height: '4rem' },
                  }}
                >
                  <AccountIcon size="100%" address={props.account.address} readonly={props.account.readonly} />
                </div>{' '}
                <div
                  css={{
                    display: 'contents',
                    [MEDIUM_CONTAINER_QUERY]: {
                      display: 'block',
                      width: 'calc(100% - 5rem)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    },
                  }}
                >
                  <Text alpha="high">{props.account.name ?? shortenAddress(props.account.address)}</Text>
                  <br />
                  <span>
                    <span css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }}>
                      <StakeStatusIndicator status={props.stakeStatus} />{' '}
                    </span>
                    <span
                      css={{
                        [MEDIUM_CONTAINER_QUERY]: { fontSize: theme.typography.body.fontSize },
                      }}
                    >
                      {props.provider}
                    </span>
                  </span>
                </div>
              </Text.BodySmall>
              <div css={{ display: 'flex', gap: '0.8rem', [MEDIUM_CONTAINER_QUERY]: { order: 1 } }}>
                {props.increaseStakeButton || <div css={{ width: '4rem' }} />}
                <div css={{ visibility: shouldRenderMenuBtn ? 'visible' : 'hidden' }}>
                  <MenuContext.Provider
                    value={{
                      attentionRequired: Boolean(props.lockedButton),
                      children: (
                        <>
                          {props.unstakeButton}
                          {props.lockedButton}
                        </>
                      ),
                    }}
                  >
                    {props.menuButton || <StakePosition.MenuButton />}
                  </MenuContext.Provider>
                </div>
              </div>
            </div>
            <div css={{ [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}>
              <Hr css={{ margin: 0 }} />
            </div>
            <section css={{ [MEDIUM_CONTAINER_QUERY]: { order: -1 }, [LARGE_CONTAINER_QUERY]: { width: '14rem' } }}>
              <Text.BodySmall
                as="div"
                alpha="disabled"
                css={{ marginBottom: '0.6rem', [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}
              >
                Asset
              </Text.BodySmall>
              <span
                css={{
                  [MEDIUM_CONTAINER_QUERY]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  },
                }}
              >
                <img
                  src={props.assetLogoSrc}
                  css={{
                    width: '2rem',
                    height: '2rem',
                    verticalAlign: '-0.25em',
                    [MEDIUM_CONTAINER_QUERY]: { width: '4rem', height: '4rem' },
                  }}
                />
                <span
                  css={{
                    display: 'contents',
                    [MEDIUM_CONTAINER_QUERY]: { display: 'none' },
                    [LARGE_CONTAINER_QUERY]: { display: 'contents' },
                  }}
                >
                  {' '}
                  <Text.BodyLarge alpha="high">
                    {props.assetSymbol}
                    <div css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }} />{' '}
                    <Text.Body alpha="medium">{props.chain}</Text.Body>
                  </Text.BodyLarge>
                </span>
              </span>
            </section>
            <section css={{ flex: 1 }}>
              <Text.BodySmall
                as="div"
                alpha="disabled"
                css={{ marginBottom: '0.6rem', [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}
              >
                Staked balance
              </Text.BodySmall>
              <Text.BodyLarge as="div" alpha="high">
                {props.balance}
                <div css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }} />{' '}
                <Text.Body alpha="medium">{props.fiatBalance}</Text.Body>
              </Text.BodyLarge>
            </section>
            <section css={{ flex: 1 }}>
              <Text.BodySmall
                as="div"
                alpha="disabled"
                css={{ marginBottom: '0.6rem', [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}
              >
                Total rewards (all time)
              </Text.BodySmall>
              <Text.BodyLarge as="div" alpha="high">
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                  {props.rewards ?? <Text alpha="medium">Coming soon</Text>}
                </Suspense>
                <div css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }} />{' '}
                <Suspense>
                  <Text.Body alpha="medium" css={{ color: '#38D448' }}>
                    {props.fiatRewards}
                  </Text.Body>
                </Suspense>
              </Text.BodyLarge>
            </section>
            <div css={{ [MEDIUM_CONTAINER_QUERY]: { width: '20rem', display: 'flex', justifyContent: 'start' } }}>
              <div>{props.withdrawButton || props.unstakingStatus}</div>
            </div>
            <div css={{ [MEDIUM_CONTAINER_QUERY]: { width: '20rem', display: 'flex', justifyContent: 'start' } }}>
              <div>{props.claimButton}</div>
            </div>
          </Surface>
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

export type StakePositionErrorBoundaryProps = {
  chain: ReactNode
  assetSymbol: ReactNode
  assetLogoSrc: string
  account: Account
  provider: ReactNode
  stakeStatus?: StakeStatus
}

export const StakePositionErrorBoundary = (props: StakePositionErrorBoundaryProps) => {
  const theme = useTheme()
  return (
    <div css={{ containerType: 'inline-size' }}>
      <Surface
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          borderRadius: '1.6rem',
          padding: '1.6rem',
          [MEDIUM_CONTAINER_QUERY]: {
            flexDirection: 'row',
            alignItems: 'center',
          },
        }}
      >
        <section css={{ [MEDIUM_CONTAINER_QUERY]: { order: -1 }, [LARGE_CONTAINER_QUERY]: { width: '14rem' } }}>
          <Text.BodySmall
            as="div"
            alpha="disabled"
            css={{ marginBottom: '0.6rem', [MEDIUM_CONTAINER_QUERY]: { display: 'none' } }}
          >
            Asset
          </Text.BodySmall>
          <span
            css={{
              [MEDIUM_CONTAINER_QUERY]: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
            }}
          >
            <img
              src={props.assetLogoSrc}
              css={{
                width: '2rem',
                height: '2rem',
                verticalAlign: '-0.25em',
                [MEDIUM_CONTAINER_QUERY]: { width: '4rem', height: '4rem' },
              }}
            />
            <span
              css={{
                display: 'contents',
                [MEDIUM_CONTAINER_QUERY]: { display: 'none' },
                [LARGE_CONTAINER_QUERY]: { display: 'contents' },
              }}
            >
              {' '}
              <Text.BodyLarge alpha="high">
                {props.assetSymbol}
                <div css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }} />{' '}
                <Text.Body alpha="medium">{props.chain}</Text.Body>
              </Text.BodyLarge>
            </span>
          </span>
        </section>
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.8rem',
            [MEDIUM_CONTAINER_QUERY]: { display: 'contents' },
          }}
        >
          <Text.BodySmall
            as="header"
            css={{
              [MEDIUM_CONTAINER_QUERY]: {
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                width: '24rem',
                fontSize: theme.typography.bodyLarge.fontSize,
              },
            }}
          >
            <div
              css={{
                display: 'inline-block',
                width: '1.2rem',
                height: '1.2rem',
                [MEDIUM_CONTAINER_QUERY]: { width: '4rem', height: '4rem' },
              }}
            >
              <AccountIcon size="100%" address={props.account.address} readonly={props.account.readonly} />
            </div>{' '}
            <div
              css={{
                display: 'contents',
                [MEDIUM_CONTAINER_QUERY]: {
                  display: 'block',
                  width: 'calc(100% - 5rem)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                },
              }}
            >
              <Text alpha="high">{props.account.name ?? shortenAddress(props.account.address)}</Text>
              <br />
              <span>
                <span css={{ display: 'none', [MEDIUM_CONTAINER_QUERY]: { display: 'revert' } }}>
                  <StakeStatusIndicator status={props.stakeStatus ?? 'not_earning_rewards'} />{' '}
                </span>
                <span
                  css={{
                    [MEDIUM_CONTAINER_QUERY]: { fontSize: theme.typography.body.fontSize },
                  }}
                >
                  {props.provider}
                </span>
              </span>
            </div>
          </Text.BodySmall>
          <div
            css={{
              display: 'flex',
              marginLeft: 'auto',
              gap: '0.8rem',
              [MEDIUM_CONTAINER_QUERY]: { order: 1 },
            }}
          >
            <Tooltip content="Error loading staking provider data">
              <TonalButton
                {...props}
                leadingIcon={<StakeStatusIndicator status={'not_nominating'} />}
                css={{
                  width: '100%',
                  backgroundColor: `color-mix(in srgb, ${theme.color.error}, transparent 95%)`,
                  color: theme.color.error,
                }}
              >
                Loading Error
              </TonalButton>
            </Tooltip>
          </div>
        </div>
      </Surface>
    </div>
  )
}

export const StakePositionList = (props: PropsWithChildren<{ className?: string }>) => (
  <section {...props}>
    <div css={{ containerType: 'inline-size' }}>
      <header
        css={{
          display: 'none',
          marginBottom: '1.2rem',
          [MEDIUM_CONTAINER_QUERY]: { display: 'flex', gap: '0.8rem', padding: '0 1.6rem' },
        }}
      >
        <Text.BodySmall
          css={{
            width: '4rem',
            visibility: 'hidden',
            [LARGE_CONTAINER_QUERY]: {
              width: '14rem',
              visibility: 'visible',
            },
          }}
        >
          Asset
        </Text.BodySmall>
        <Text.BodySmall css={{ width: '24rem' }}>Account</Text.BodySmall>
        <Text.BodySmall css={{ flex: 1 }}>Staked balance</Text.BodySmall>
        <Text.BodySmall css={{ flex: 1 }}>Total rewards (all time)</Text.BodySmall>
        <Text.BodySmall css={{ width: '20rem' }}>Unstake / Withdraw</Text.BodySmall>
        <Text.BodySmall css={{ width: '20rem' }}>Claim</Text.BodySmall>
        <Text.BodySmall css={{ width: '8.8rem', textAlign: 'end' }}>Actions</Text.BodySmall>
      </header>
    </div>
    <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>{props.children}</div>
  </section>
)

export default StakePosition
