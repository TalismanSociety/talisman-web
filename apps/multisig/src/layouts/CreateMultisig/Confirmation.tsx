import MemberRow from '@components/MemberRow'
import { Chain, Token, getInitialProxyBalance } from '@domains/chains'
import { InjectedAccount } from '@domains/extension'
import { AugmentedAccount, Balance, balanceToFloat } from '@domains/multisig'
import { css } from '@emotion/css'
import { Info } from '@talismn/icons'
import { Button, IconButton, Identicon, Select } from '@talismn/ui'
import { Skeleton } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { formatUsd } from '@util/numbers'
import { Loadable } from 'recoil'
import truncateMiddle from 'truncate-middle'

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
  selectedSigner: InjectedAccount | undefined
  setSelectedSigner: (signer: InjectedAccount) => void
  augmentedAccounts: AugmentedAccount[]
  threshold: number
  name: string
  chain: Chain
  tokenWithPrice: Loadable<{ token: Token; price: number }>
  reserveAmount: Loadable<Balance>
  existentialDeposit: Loadable<Balance>
  estimatedFee: Balance | undefined
  extrinsicsReady: boolean
}) => {
  const { tokenWithPrice, reserveAmount, estimatedFee, chain, existentialDeposit } = props

  const existentialDepositComponent =
    tokenWithPrice.state === 'hasValue' && existentialDeposit.state === 'hasValue' ? (
      <Cost
        amount={getInitialProxyBalance(existentialDeposit.contents)}
        symbol={tokenWithPrice.contents.token.symbol}
        price={tokenWithPrice.contents.price}
      />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )

  const reserveAmountComponent =
    tokenWithPrice.state === 'hasValue' && reserveAmount.state === 'hasValue' ? (
      <Cost
        amount={reserveAmount.contents}
        symbol={tokenWithPrice.contents.token.symbol}
        price={tokenWithPrice.contents.price}
      />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )

  const feeAmountComponent =
    tokenWithPrice.state === 'hasValue' && estimatedFee ? (
      <Cost amount={estimatedFee} symbol={tokenWithPrice.contents.token.symbol} price={tokenWithPrice.contents.price} />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-self: flex-start;
        padding: 48px;
      `}
    >
      <h1>Confirmation</h1>
      <p
        className={css`
          text-align: center;
          margin-top: 16px;
        `}
      >
        Please review and confirm details before proceeding.
      </p>
      <div
        className={css`
          background: var(--color-controlBackground);
          border-radius: 16px;
          display: grid;
          grid-template-rows: 48px 32px;
          grid-template-columns: 1fr 78px;
          padding: 16px;
          line-height: 0;
          margin-top: 48px;
          width: 100%;
        `}
      >
        <h1>{props.name}</h1>
        <div
          className={css`
            grid-area: 2 / 1 / 3 / 2;
            display: flex;
            align-items: center;
            width: fit-content;
            gap: 8px;
            border-radius: 24px;
            padding: 16px 24px;
            background-color: #2f2f2f;
          `}
        >
          <div css={{ width: '1em', height: '1em' }}>
            <img src={chain.logo} css={{ width: '100%', height: '100%', borderRadius: '50%' }} alt={chain.chainName} />
          </div>
          <p
            className={css`
              margin-top: 4px;
              font-size: 14px;
            `}
          >
            {chain.chainName}
          </p>
        </div>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          `}
        >
          <p>Threshold</p>
          <p
            className={css`
              font-size: 24px;
              color: var(--color-offWhite);
            `}
          >{`${props.threshold}/${props.augmentedAccounts.length}`}</p>
        </div>
      </div>
      <div
        className={css`
          display: grid;
          background: var(--color-controlBackground);
          border-radius: 16px;
          padding: 16px;
          margin-top: 24px;
          width: 100%;
          gap: 16px;
        `}
      >
        <h2
          className={css`
            font-size: 20px;
          `}
        >
          Members
        </h2>
        {props.augmentedAccounts.map(account => {
          return <MemberRow key={account.address} member={account} truncate={true} />
        })}
      </div>
      <div
        className={css`
          display: grid;
          grid-template-rows: auto auto;
          background: var(--color-controlBackground);
          border-radius: 16px;
          padding: 16px;
          margin-top: 24px;
          width: 100%;
          gap: 8px;
          div {
            gap: 16px;
          }
        `}
      >
        <div
          className={css`
            button {
              padding: 6px 0px;
              @media ${device.lg} {
                padding: 6px 6px;
              }
            }
          `}
        >
          <h2
            className={css`
              font-size: 20px;
              margin-bottom: 8px;
            `}
          >
            Depositor
          </h2>
          <Select
            placeholder="Select account"
            value={props?.selectedSigner?.address}
            onChange={value =>
              props.setSelectedSigner(props.augmentedAccounts.find(a => a.address === value) as AugmentedAccount)
            }
            {...props}
          >
            {props.augmentedAccounts.map(account => (
              <Select.Item
                key={account.address}
                leadingIcon={<Identicon value={account.address} />}
                value={account.address}
                headlineText={account.nickname}
                supportingText={truncateMiddle(account.address, 5, 4, '...')}
              />
            ))}
          </Select>
        </div>
        <div
          className={css`
            display: flex;
            align-items: center;
          `}
        >
          <IconButton size="54px" contentColor={'#d5ff5c'}>
            <Info />
          </IconButton>
          <p>
            To operate your vault {chain.chainName} requires some funds to be reserved as a deposit. This will be fully
            refunded when you wind down your vault.
          </p>
        </div>
      </div>
      <div
        className={css`
          display: grid;
          margin-top: 16px;
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
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button
          disabled={tokenWithPrice.state !== 'hasValue' || props.augmentedAccounts.length < 2 || !props.extrinsicsReady}
          onClick={props.onCreateVault}
          children={<h3>Create Vault</h3>}
        />
      </div>
    </div>
  )
}

export default Confirmation
