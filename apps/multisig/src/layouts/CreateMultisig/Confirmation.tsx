import MemberRow from '@components/MemberRow'
import { css } from '@emotion/css'
import { Info } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { Skeleton } from '@talismn/ui'
import { formatUsd } from '@util/numbers'
import { Loadable } from 'recoil'

import { ChainSummary, Token } from '../../domain/chains'
import { AugmentedAccount, Step } from '.'

const Cost = (props: { amount: number; symbol: string; price: number }) => (
  <p>
    {props.amount} {props.symbol} ({formatUsd(props.amount * props.price)})
  </p>
)

const Confirmation = (props: {
  setStep: React.Dispatch<React.SetStateAction<Step>>
  augmentedAccounts: AugmentedAccount[]
  threshold: number
  name: string
  chain: ChainSummary
  tokenWithPrice: Loadable<{ token: Token; price: number }>
  reserveAmount: number
  fee: number
}) => {
  const { tokenWithPrice, reserveAmount, fee, chain } = props

  const reserveAmountComponent =
    tokenWithPrice.state === 'hasValue' ? (
      <Cost
        amount={reserveAmount}
        symbol={tokenWithPrice.contents.token.symbol}
        price={tokenWithPrice.contents.price}
      />
    ) : (
      <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
    )

  const feeAmountComponent =
    tokenWithPrice.state === 'hasValue' ? (
      <Cost amount={fee} symbol={tokenWithPrice.contents.token.symbol} price={tokenWithPrice.contents.price} />
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
          return <MemberRow key={account.address} member={account} />
        })}
      </div>
      <div
        className={css`
          display: grid;
          margin-top: 24px;
          grid-template-columns: 1fr auto;
          grid-template-rows: 1fr 1fr;
          justify-content: space-between;
          width: 100%;
          p:nth-child(even) {
            margin-left: auto;
          }
        `}
      >
        <p>Reserved Amount</p>
        {reserveAmountComponent}
        <p>Estimated Fee</p>
        {feeAmountComponent}
      </div>
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-controlBackground);
          border-radius: 16px;
          padding: 16px;
          margin-top: 8px;
          width: 100%;
          gap: 16px;
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
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button
          onClick={() => {
            props.setStep('selectFirstChain')
          }}
          children={<h3>Back</h3>}
          variant="outlined"
        />
        <Button
          disabled={tokenWithPrice.state !== 'hasValue' || props.augmentedAccounts.length < 2}
          onClick={() => {
            props.setStep('selectFirstChain')
          }}
          children={<h3>Create Vault</h3>}
        />
      </div>
    </div>
  )
}

export default Confirmation
