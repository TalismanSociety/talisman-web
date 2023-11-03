import { BaseToken, Chain, Price, getInitialProxyBalance } from '@domains/chains'
import { AugmentedAccount, Balance, ProxyDefinition } from '@domains/multisig'
import { css } from '@emotion/css'
import { Info } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { Skeleton } from '@talismn/ui'
import { balanceToFloat, formatUsd } from '@util/numbers'
import { Loadable } from 'recoil'
import { Address, toMultisigAddress } from '../../../util/addresses'
import { AccountDetails } from '../../../components/AddressInput/AccountDetails'
import { ChainPill } from '../../../components/ChainPill'
import { Member } from '../../../components/Member'
import React from 'react'
import { secondsToDuration } from '../../../util/misc'
import { CancleOrNext } from './CancelOrNext'

const NameAndSummary: React.FC<{ name: string; chain: Chain; proxiedAccount?: Address }> = ({
  name,
  chain,
  proxiedAccount,
}) => (
  <div
    css={{
      display: 'grid',
      width: '100%',
      background: 'var(--color-controlBackground)',
      padding: '24px 16px',
      borderRadius: 16,
      gap: 4,
    }}
  >
    <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 css={({ color }) => ({ color: color.offWhite })}>{name}</h2>
      <ChainPill chain={chain} />
    </div>
    {proxiedAccount ? (
      <div css={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <p>Import proxied account</p>
        <div
          css={({ color }) => ({
            p: { fontSize: 14 },
            padding: '2px 6px',
            backgroundColor: color.surface,
            borderRadius: 8,
          })}
        >
          <AccountDetails identiconSize={20} address={proxiedAccount} />
        </div>
      </div>
    ) : (
      <p css={({ color }) => ({ span: { color: color.offWhite } })}>
        Create new <span>Pure Proxied Account</span>
      </p>
    )}
  </div>
)

const Members: React.FC<{ members: AugmentedAccount[]; chain: Chain }> = ({ members, chain }) => (
  <div css={{ display: 'grid', gap: 12 }}>
    <p>Members</p>
    <div css={{ display: 'grid', gap: 8 }}>
      {members.map(account => (
        <Member key={account.address.toPubKey()} m={account} chain={chain} />
      ))}
    </div>
  </div>
)

const Threshold: React.FC<{ threshold: number; membersCount: number }> = ({ threshold, membersCount }) => (
  <div css={{ display: 'grid', gap: 12 }}>
    <p>Threshold</p>
    <p css={({ color }) => ({ color: color.offWhite })}>
      {threshold} of {membersCount} Members
    </p>
  </div>
)

const ProxyTypes: React.FC<{ proxies: ProxyDefinition[] }> = ({ proxies }) => (
  <div css={{ display: 'grid', gap: 12 }}>
    <p>Proxy Types</p>
    <div css={{ display: 'grid', gap: 8 }}>
      {proxies.map(proxy => (
        <p key={`${proxy.proxyType}_${proxy.delay}`} css={({ color }) => ({ color: color.offWhite })}>
          {proxy.proxyType}, {proxy.delay} blocks ≈{secondsToDuration(proxy.duration)}
        </p>
      ))}
    </div>
  </div>
)

const Cost = (props: { amount: Balance; symbol: string; price: number }) => {
  return (
    <p>
      {balanceToFloat(props.amount)} {props.symbol} ({formatUsd(balanceToFloat(props.amount) * props.price)})
    </p>
  )
}

const Confirmation = (props: {
  onBack: () => void
  onCreateVault: () => void
  selectedAccounts: AugmentedAccount[]
  proxiedAccount?: Address
  threshold: number
  name: string
  chain: Chain
  tokenWithPrice?: Loadable<{ token: BaseToken; price: Price }>
  reserveAmount?: Loadable<Balance>
  existentialDeposit?: Loadable<Balance>
  estimatedFee?: Balance | undefined
  extrinsicsReady?: boolean
}) => {
  const { tokenWithPrice, reserveAmount, estimatedFee, chain, existentialDeposit } = props

  const multisigAddress = toMultisigAddress(
    props.selectedAccounts.map(a => a.address),
    props.threshold
  )

  const existentialDepositComponent = tokenWithPrice ? (
    tokenWithPrice?.state === 'hasValue' && existentialDeposit?.state === 'hasValue' ? (
      <Cost
        amount={getInitialProxyBalance(existentialDeposit.contents)}
        symbol={tokenWithPrice.contents.token.symbol}
        price={tokenWithPrice.contents.price.current}
      />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )
  ) : null

  const reserveAmountComponent =
    tokenWithPrice && reserveAmount ? (
      tokenWithPrice.state === 'hasValue' && reserveAmount.state === 'hasValue' ? (
        <Cost
          amount={reserveAmount.contents}
          symbol={tokenWithPrice.contents.token.symbol}
          price={tokenWithPrice.contents.price.current}
        />
      ) : (
        <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
      )
    ) : null

  const feeAmountComponent = tokenWithPrice ? (
    tokenWithPrice.state === 'hasValue' && estimatedFee ? (
      <Cost
        amount={estimatedFee}
        symbol={tokenWithPrice.contents.token.symbol}
        price={tokenWithPrice.contents.price.current}
      />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )
  ) : null

  return (
    <div
      css={{
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'flex-start',
        gap: 32,
        maxWidth: 620,
        width: '100%',
      }}
    >
      <div>
        <h1>Confirmation</h1>
        <p css={{ textAlign: 'center', marginTop: 16 }}>Please review and confirm details before proceeding.</p>
      </div>
      <NameAndSummary name={props.name} chain={chain} proxiedAccount={props.proxiedAccount} />
      <div
        css={{
          display: 'grid',
          background: ' var(--color-controlBackground)',
          gap: 16,
          padding: '24px 16px',
          borderRadius: 16,
          width: '100%',
        }}
      >
        <h2 css={({ color }) => ({ color: color.offWhite, fontSize: 16 })}>Vault Config</h2>
        <div css={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', alignItems: 'flex-start' }}>
          <Members members={props.selectedAccounts} chain={props.chain} />
          <div css={{ display: 'grid', gap: 32 }}>
            <Threshold threshold={props.threshold} membersCount={props.selectedAccounts.length} />

            {/** TODO: create a component to load proxies with useProxies */}
            <ProxyTypes
              proxies={[
                {
                  proxyType: 'Any',
                  delay: 0,
                  duration: 0,
                  delegate: multisigAddress,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div
        className={css`
          display: flex;
          align-items: center;
          background: var(--color-controlBackground);
          border-radius: 16px;
          padding: 16px;
          width: 100%;
          gap: 16px;
        `}
      >
        <IconButton size="54px" contentColor={'#d5ff5c'}>
          <Info size={54} />
        </IconButton>
        <p>
          To operate your vault {chain.chainName} requires some funds to be reserved as a deposit. This will be fully
          refunded when you wind down your vault.
        </p>
      </div>
      {!props.proxiedAccount && (
        <div
          className={css`
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: 1fr 1fr;
            justify-content: space-between;
            width: 100%;
            p:nth-child(even) {
              margin-left: auto;
            }
          `}
        >
          <p>Deposit Amount (Reserved)</p>
          {reserveAmountComponent}
          <p>Estimated Transaction Fee</p>
          {feeAmountComponent}
          <p>Initial Vault Funds</p>
          {existentialDepositComponent}
        </div>
      )}
      <CancleOrNext
        block
        cancel={{
          onClick: props.onBack,
          children: 'Back',
        }}
        next={{
          children: props.proxiedAccount ? 'Import Vault' : 'Create Vault',
          onClick: props.onCreateVault,
          // TODO: disable with error message if same multisig + proxied account exists with the same name
          disabled:
            (tokenWithPrice && tokenWithPrice.state !== 'hasValue') ||
            props.selectedAccounts.length < 2 ||
            props.extrinsicsReady === false,
        }}
      />
    </div>
  )
}

export default Confirmation
