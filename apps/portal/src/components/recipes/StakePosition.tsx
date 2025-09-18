import type { ButtonProps } from '@talismn/ui/atoms/Button'
import type { IconButtonProps } from '@talismn/ui/atoms/IconButton'
import type { MenuItemProps } from '@talismn/ui/molecules/Menu'
import type { PropsWithChildren, ReactNode } from 'react'
import { Badge, BadgedBox } from '@talismn/ui/atoms/Badge'
import { SurfaceButton, TonalButton } from '@talismn/ui/atoms/Button'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Hr } from '@talismn/ui/atoms/Hr'
import { SurfaceIconButton, TonalIconButton } from '@talismn/ui/atoms/IconButton'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { Menu } from '@talismn/ui/molecules/Menu'
import { useTheme } from '@talismn/ui/theme'
import { ArrowDown, Clock, Earn, MoreHorizontal, ZapPlus } from '@talismn/web-icons'
import React, { createContext, Suspense, useContext } from 'react'

import type { StakeStatus } from '@/components/recipes/StakeStatusIndicator'
import { AccountIcon } from '@/components/molecules/AccountIcon'
import { AssetLogoWithChain } from '@/components/recipes/AssetLogoWithChain'
import { StakeStatusIndicator } from '@/components/recipes/StakeStatusIndicator'
import { Account } from '@/domains/accounts/recoils'
import { truncateAddress } from '@/util/truncateAddress'

import { StakePositionSkeleton } from './StakePosition.skeleton'

export type StakePositionProps = {
  readonly?: boolean
  isError?: boolean
  errorMessage?: string | null
  account: Account
  provider: ReactNode
  shortProvider?: ReactNode
  stakeStatus: StakeStatus
  assetSymbol: ReactNode
  assetLogoSrc: string
  chain: ReactNode
  chainId: string | number
  balance: ReactNode
  fiatBalance: ReactNode
  rewards?: ReactNode
  fiatRewards?: ReactNode
  isRewardsLoading?: boolean
  unstakingStatus?: ReactNode
  increaseStakeButton?: ReactNode
  changeValidatorButton?: ReactNode
  cancelUnstakeButton?: ReactNode
  unstakeButton?: ReactNode
  lockedButton?: ReactNode
  menuButton?: ReactNode
  claimButton?: ReactNode
  withdrawButton?: ReactNode
}

const StakePositionContext = createContext({ readonly: false, isError: false, errorMessage: '' })

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
    {({ readonly, isError, errorMessage }) => (
      <Tooltip content={readonly ? 'Account is readonly' : errorMessage} disabled={!readonly && !isError}>
        <Menu.Item.Button headlineContent="Unstake" disabled={readonly || isError} {...props} />
      </Tooltip>
    )}
  </StakePositionContext.Consumer>
)

const CancelUnstakeButton = (props: Omit<MenuItemProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly }) => {
      return (
        <Tooltip content="Account is readonly" disabled={!readonly}>
          <Menu.Item.Button headlineContent="Cancel Unstake" disabled={readonly} {...props} />
        </Tooltip>
      )
    }}
  </StakePositionContext.Consumer>
)

const ChangeValidatorButton = (props: Omit<MenuItemProps, 'children'>) => (
  <StakePositionContext.Consumer>
    {({ readonly, isError, errorMessage }) => {
      return (
        <Tooltip content={readonly ? 'Account is readonly' : errorMessage} disabled={!readonly && !isError}>
          <Menu.Item.Button headlineContent="Change Validator" disabled={readonly || isError} {...props} />
        </Tooltip>
      )
    }}
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
        <TonalButton {...props} leadingIcon={<Earn />} disabled={readonly} className="!w-full">
          <span className="@[100rem]:hidden">Claim </span>
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
        <SurfaceButton {...props} leadingIcon={<ArrowDown />} disabled={readonly} className="!w-full">
          <span className="@[100rem]:hidden">Withdraw </span>
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
          <React.Fragment key={index}>
            <Text.Body as="div" alpha="high">
              {x.amount}
            </Text.Body>
            <Text.Body as="div">{x.eta}</Text.Body>
            {index < array.length - 1 && <Hr />}
          </React.Fragment>
        ))}
      </div>
    }
    disabled={props.unlocks.length === 0}
  >
    <SurfaceButton leadingIcon={<Clock />} disabled className="!w-full">
      <span className="@[100rem]:hidden">Unstaking </span>
      {props.amount}
    </SurfaceButton>
  </Tooltip>
)

export const FastUnstakingStatus = (props: { amount: ReactNode; status: 'in-head' | 'in-queue' | undefined }) => (
  <SurfaceButton leadingIcon={<CircularProgressIndicator />} disabled className="!w-full">
    <span className="@[100rem]:hidden">Fast unstaking </span>
    {props.amount}
  </SurfaceButton>
)

export const StakePosition = Object.assign(
  (props: StakePositionProps) => {
    const shouldRenderMenuBtn = props.unstakeButton || props.lockedButton || props.menuButton
    const shouldRenderTotalRewards = props.rewards || props.fiatRewards

    return (
      <StakePositionContext.Provider
        value={{
          readonly: props.readonly ?? false,
          isError: props.isError ?? false,
          errorMessage: props.errorMessage ?? '',
        }}
      >
        <div className="@container">
          <Surface className="@[100rem]:flex-row @[100rem]:items-center flex flex-col gap-[0.8rem] rounded-[1.6rem] p-[1.6rem]">
            <div className="@[100rem]:contents flex items-center justify-between gap-[0.8rem]">
              <Text.BodySmall as="header" className="@[100rem]:hidden">
                <div className="inline-block h-[1.2rem] w-[1.2rem]">
                  <AccountIcon size="100%" account={props.account} />
                </div>{' '}
                <div className="contents">
                  <Text alpha="high">{props.account.name ?? truncateAddress(props.account.address)}</Text>
                  <br />
                  <span>
                    <span>{props.provider}</span>
                  </span>
                </div>
              </Text.BodySmall>
              <div className="@[100rem]:order-1 flex gap-[0.8rem]">
                {props.increaseStakeButton || <div className="w-[4rem]" />}
                <div className={shouldRenderMenuBtn ? 'visible' : 'invisible'}>
                  <MenuContext.Provider
                    value={{
                      attentionRequired: Boolean(props.lockedButton),
                      children: (
                        <>
                          {props.unstakeButton}
                          {props.lockedButton}
                          {props.changeValidatorButton}
                          {props.cancelUnstakeButton}
                        </>
                      ),
                    }}
                  >
                    {props.menuButton || <StakePosition.MenuButton />}
                  </MenuContext.Provider>
                </div>
              </div>
            </div>
            <div className="@[100rem]:hidden">
              <Hr className="m-0" />
            </div>

            <div className="@[100rem]:hidden flex gap-8">
              <section>
                <Text.BodySmall as="div" alpha="disabled" className="!mb-[0.6rem]">
                  Asset
                </Text.BodySmall>
                <div className="flex items-start gap-[1.2rem]">
                  <AssetLogoWithChain assetLogoUrl={props.assetLogoSrc} chainId={props.chainId} />
                  <div className="truncate text-[1.4rem] text-[#fafafa]">
                    {props.assetSymbol}
                    <div className="truncate text-[1.2rem] opacity-70">{props.chain}</div>
                  </div>
                </div>
              </section>
              <section>
                <Text.BodySmall as="div" alpha="disabled" className="!mb-[0.6rem]">
                  Staked balance
                </Text.BodySmall>
                <div className="flex items-start gap-[1.2rem]">
                  <div className="truncate text-[1.4rem] text-[#fafafa]">
                    {props.balance}
                    <div className="truncate text-[1.2rem] opacity-70">{props.fiatBalance}</div>
                  </div>
                </div>
              </section>
            </div>

            <section className="@[100rem]:block @[120rem]:w-[14rem] hidden">
              <Text.BodySmall as="div" alpha="disabled" className="@[100rem]:hidden !mb-[0.6rem]">
                Asset
              </Text.BodySmall>
              <span className="flex items-center gap-[1.2rem]">
                <AssetLogoWithChain assetLogoUrl={props.assetLogoSrc} chainId={props.chainId} />
                <span className="@[100rem]:hidden @[120rem]:contents contents">
                  <Text.Body className="truncate" as="div" alpha="high">
                    {props.assetSymbol}
                    <Text.BodySmall className="truncate" as="div">
                      {props.chain}
                    </Text.BodySmall>
                  </Text.Body>
                </span>
              </span>
            </section>
            <Text.BodySmall as="header" className="@[100rem]:flex hidden w-[24rem] items-center gap-[1.2rem]">
              <div className="inline-block h-[4rem] w-[4rem]">
                <AccountIcon size="100%" account={props.account} />
              </div>{' '}
              <div className="w-[calc(100%_-_5rem)] truncate">
                <Text alpha="high">{props.account.name ?? truncateAddress(props.account.address)}</Text>
                <br />
                <span>
                  <span>
                    <StakeStatusIndicator status={props.stakeStatus} />{' '}
                  </span>
                  <span>{props.provider}</span>
                </span>
              </div>
            </Text.BodySmall>
            <section className="@[100rem]:block hidden flex-1">
              <Text.BodySmall as="div" alpha="disabled" className="@[100rem]:hidden !mb-[0.6rem]">
                Staked balance
              </Text.BodySmall>
              <Text.Body as="div" alpha="high">
                {props.balance}
                <div className="@[100rem]:block hidden" /> <Text.Body alpha="medium">{props.fiatBalance}</Text.Body>
              </Text.Body>
            </section>

            {shouldRenderTotalRewards && (
              <section className="flex-1">
                <Text.BodySmall as="div" alpha="disabled" className="@[100rem]:hidden !mb-[0.6rem]">
                  Total rewards (all time)
                </Text.BodySmall>
                <Text.Body as="div" alpha="high">
                  {props.isRewardsLoading ? (
                    <CircularProgressIndicator size="1em" />
                  ) : (
                    <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                      {props.rewards ?? <Text alpha="medium">--</Text>}
                    </Suspense>
                  )}
                  <div className="@[100rem]:block hidden" />{' '}
                  <Suspense>
                    <Text.Body alpha="medium" className="!text-[#38D448]">
                      {props.fiatRewards}
                    </Text.Body>
                  </Suspense>
                </Text.Body>
              </section>
            )}
            <div className="@[100rem]:w-[20rem] @[100rem]:flex @[100rem]:justify-start">
              <div>{props.withdrawButton || props.unstakingStatus}</div>
            </div>
            <div className="@[100rem]:w-[20rem] @[100rem]:flex @[100rem]:justify-start">
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
    ChangeValidatorButton,
    CancelUnstakeButton,
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
    <div className="@container">
      <Surface className="@[100rem]:flex-row @[100rem]:items-center flex flex-col gap-[0.8rem] rounded-[1.6rem] p-[1.6rem]">
        <section className="@[120rem]:w-[24rem]">
          <Text.BodySmall as="div" alpha="disabled" className="@[100rem]:hidden !mb-[0.6rem]">
            Asset
          </Text.BodySmall>
          <span className="@[100rem]:flex @[100rem]:items-center @[100rem]:gap-[1.2rem]">
            <img
              className="@[100rem]:w-[4rem] @[100rem]:h-[4rem] h-[2rem] w-[2rem] align-[-0.25em]"
              src={props.assetLogoSrc}
            />
            <span className="@[100rem]:hidden @[120rem]:contents contents">
              {' '}
              <Text.Body alpha="high">
                {props.assetSymbol}
                <div className="@[100rem]:block hidden" /> <Text.Body alpha="medium">{props.chain}</Text.Body>
              </Text.Body>
            </span>
          </span>
        </section>
        <div className="@[100rem]:contents flex items-center justify-between gap-[0.8rem]">
          <Text.BodySmall
            as="header"
            className="@[100rem]:flex @[100rem]:items-center @[100rem]:gap-[1.2rem] @[100rem]:w-[24rem]"
          >
            <div className="@[100rem]:w-[4rem] @[100rem]:h-[4rem] inline-block h-[1.2rem] w-[1.2rem]">
              <AccountIcon size="100%" account={props.account} />
            </div>{' '}
            <div className="@[100rem]:block @[100rem]:w-[calc(100%_-_5rem)] @[100rem]:truncate contents">
              <Text alpha="high">{props.account.name ?? truncateAddress(props.account.address)}</Text>
              <br />
              <span>
                <span className="@[100rem]:inline hidden">
                  <StakeStatusIndicator status={props.stakeStatus ?? 'not_earning_rewards'} />{' '}
                </span>
                <span>{props.provider}</span>
              </span>
            </div>
          </Text.BodySmall>
          <div className="@[100rem]:order-1 ml-auto flex gap-[0.8rem]">
            <Tooltip content="Error loading staking provider data">
              <TonalButton
                {...props}
                leadingIcon={<StakeStatusIndicator status={'not_nominating'} />}
                className="!w-full"
                css={{
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
    <div className="@container">
      <header className="@[100rem]:flex mb-[1.2rem] hidden gap-[0.8rem] px-[1.6rem]">
        <Text.BodySmall className="@[120rem]:visible @[120rem]:w-56 invisible w-16">Asset</Text.BodySmall>
        <Text.BodySmall className="w-[24rem]">Account</Text.BodySmall>
        <Text.BodySmall className="flex-1">Staked balance</Text.BodySmall>
        <Text.BodySmall className="flex-1">Total rewards (all time)</Text.BodySmall>
        <Text.BodySmall className="w-[20rem]">Unstake / Withdraw</Text.BodySmall>
        <Text.BodySmall className="w-[20rem]">Claim</Text.BodySmall>
        <Text.BodySmall className="w-[8.8rem] text-end">Actions</Text.BodySmall>
      </header>
    </div>
    <div className="flex flex-col gap-[0.8rem]">{props.children}</div>
  </section>
)
