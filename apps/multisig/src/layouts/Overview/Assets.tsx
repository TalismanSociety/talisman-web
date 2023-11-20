import { BaseToken } from '@domains/chains'
import { css } from '@emotion/css'
import { Balance } from '@talismn/balances'
import { Lock } from '@talismn/icons'
import { AnimatedNumber } from '@talismn/ui'
import { formatDecimals } from '@talismn/util'
import { formatUsd } from '@util/numbers'
import { capitalizeFirstLetter } from '@util/strings'
import { useMemo } from 'react'

export interface TokenAugmented {
  id: string
  details: BaseToken
  balance: {
    avaliable: number
    unavaliable: number
  }
  balanceDetails: Balance
  price: number
}

const TokenRow = ({ augmentedToken, balance }: { augmentedToken: TokenAugmented; balance: number }) => {
  const { details, price } = augmentedToken
  return (
    <div
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
        <p>{capitalizeFirstLetter(details.chain.chainName)}</p>
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
    return augmentedTokens.reduce(
      (acc, { balance, price }) => acc + (balance.avaliable + balance.unavaliable) * price,
      0
    )
  }, [augmentedTokens])
  const totalUnavaliableBalance = useMemo(() => {
    return augmentedTokens.reduce((acc, { balance }) => acc + balance.unavaliable, 0)
  }, [augmentedTokens])
  const totalAvaliableBalance = useMemo(() => {
    return augmentedTokens.reduce((acc, { balance }) => acc + balance.avaliable, 0)
  }, [augmentedTokens])

  const avaliableSorted = useMemo(() => {
    return augmentedTokens
      .filter(({ balance }) => balance.avaliable > 0)
      .sort((a1, a2) => a2.balance.avaliable * a2.price - a1.balance.avaliable * a1.price)
  }, [augmentedTokens])

  const unavaliableSorted = useMemo(() => {
    return augmentedTokens
      .filter(({ balance }) => balance.unavaliable > 0)
      .sort((a1, a2) => a2.balance.unavaliable * a2.price - a1.balance.unavaliable * a1.price)
  }, [augmentedTokens])

  return (
    <section
      className={css`
        background-color: var(--color-grey800);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
        padding: 24px;
      `}
    >
      <>
        <div
          className={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <h2 css={{ color: 'var(--color-offWhite)', fontWeight: 'bold' }}>Assets</h2>
          <h2 css={{ fontWeight: 'bold' }}>
            <AnimatedNumber formatter={formatUsd} end={totalFiatBalance} decimals={2} />
          </h2>
        </div>
        {totalAvaliableBalance > 0 ? (
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
              {avaliableSorted.map(augmentedToken => {
                return (
                  <TokenRow
                    key={augmentedToken.id}
                    augmentedToken={augmentedToken}
                    balance={augmentedToken.balance.avaliable}
                  />
                )
              })}
            </div>
          </div>
        ) : null}
        {totalUnavaliableBalance > 0 ? (
          <div>
            <div css={{ display: 'grid', gap: '16px' }}>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  color: var(--color-dim);
                  font-weight: bold;
                  svg {
                    height: 15px;
                    margin-bottom: 3px;
                  }
                  p {
                    font-weight: bold;
                  }
                `}
              >
                <p>Unavaliable</p>
                <Lock />
              </div>
              {unavaliableSorted.map(augmentedToken => {
                return (
                  <TokenRow
                    key={augmentedToken.id}
                    augmentedToken={augmentedToken}
                    balance={augmentedToken.balance.unavaliable}
                  />
                )
              })}
            </div>
          </div>
        ) : null}
      </>
    </section>
  )
}

export default Assets
