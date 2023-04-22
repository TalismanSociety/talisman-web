import { css } from '@emotion/css'
import { Lock } from '@talismn/icons'
import { AnimatedNumber } from '@talismn/ui'
import { formatDecimals } from '@talismn/util'
import { formatUsd } from '@util/numbers'
import { capitalizeFirstLetter } from '@util/strings'
import { useMemo } from 'react'

import { Token } from '../../domain/chains'

export interface TokenAugmented {
  details: Token
  balance: {
    free: number
    locked: number
  }
  price: number
}

const TokenRow = ({ augmentedToken, balance }: { augmentedToken: TokenAugmented; balance: number }) => {
  const { details, price } = augmentedToken
  return (
    <div
      key={details.id}
      className={css`
        height: 43px;
        width: 100%;
        display: flex;
        div > p:nth-child(1) {
          font-weight: bold;
          color: var(--color-offWhite);
        }
        div > p:nth-child(2) {
          font-size: 14px;
        }
      `}
    >
      <img css={{ height: '40px', marginRight: '8px' }} src={details.logo} alt="Token logo" />
      <div>
        <p>{details.symbol}</p>
        <p>{capitalizeFirstLetter(details.chain.id)}</p>
      </div>
      <div css={{ marginLeft: 'auto', textAlign: 'right' }}>
        <p>
          {formatDecimals(balance)} {details.symbol}
        </p>
        <p>{formatUsd(balance * price)}</p>
      </div>
    </div>
  )
}

const Assets = ({ augmentedTokens }: { augmentedTokens: TokenAugmented[] }) => {
  const totalFiatBalance = useMemo(() => {
    return augmentedTokens.reduce((acc, { balance, price }) => acc + (balance.free + balance.locked) * price, 0)
  }, [augmentedTokens])
  const totalLockedBalance = useMemo(() => {
    return augmentedTokens.reduce((acc, { balance }) => acc + balance.locked, 0)
  }, [augmentedTokens])
  const totalFreeBalance = useMemo(() => {
    return augmentedTokens.reduce((acc, { balance }) => acc + balance.free, 0)
  }, [augmentedTokens])

  console.log(totalFiatBalance)
  return (
    <section
      className={css`
        grid-area: assets;
        background-color: var(--color-grey800);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
      `}
    >
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <h2 css={{ color: 'var(--color-offWhite)' }}>Assets</h2>
        <h2>
          <AnimatedNumber formatter={formatUsd} end={totalFiatBalance} decimals={2} />
        </h2>
      </div>
      {totalFreeBalance > 0 && (
        <div>
          <div css={{ display: 'grid', gap: '16px' }}>
            <p
              className={css`
                color: var(--color-dim);
                font-weight: bold;
              `}
            >
              Avaliable
            </p>
            {augmentedTokens
              .sort((a1, a2) => a2.balance.free - a1.balance.free)
              .map(augmentedToken => {
                if (augmentedToken.balance.free === 0) return <></>
                return (
                  <TokenRow
                    key={augmentedToken.details.id}
                    augmentedToken={augmentedToken}
                    balance={augmentedToken.balance.free}
                  />
                )
              })}
          </div>
        </div>
      )}
      {totalLockedBalance > 0 && (
        <div>
          <div css={{ display: 'grid', gap: '16px' }}>
            <p
              className={css`
                color: var(--color-dim);
                font-weight: bold;
              `}
            >
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  svg {
                    height: 15px;
                    margin-bottom: 3px;
                  }
                `}
              >
                Locked
                <Lock />
              </div>
            </p>
            {augmentedTokens
              .sort((a1, a2) => a2.balance.locked - a1.balance.locked)
              .map(augmentedToken => {
                if (augmentedToken.balance.locked === 0) return <></>
                return (
                  <TokenRow
                    key={augmentedToken.details.id}
                    augmentedToken={augmentedToken}
                    balance={augmentedToken.balance.locked}
                  />
                )
              })}
          </div>
        </div>
      )}
    </section>
  )
}

export default Assets