import StatusCircle, { StatusCircleType } from '@components/StatusCircle'
import { tokenPricesState } from '@domains/chains'
import { Balance, Transaction, TransactionType, balanceToFloat, calcSumOutgoing } from '@domains/multisig'
import { css } from '@emotion/css'
import { ArrowUp, List, Share2 } from '@talismn/icons'
import { Skeleton } from '@talismn/ui'
import { formatUsd } from '@util/numbers'
import { useMemo } from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { formattedHhMm } from './utils'

const TransactionSummaryRow = ({ t, onClick }: { t: Transaction; onClick?: () => void }) => {
  const sumOutgoing: Balance[] = useMemo(() => calcSumOutgoing(t), [t])
  const tokenPrices = useRecoilValueLoadable(tokenPricesState(sumOutgoing.map(b => b.token.coingeckoId)))
  const threshold = 2
  const sumPriceUsd: number | undefined = useMemo(() => {
    if (tokenPrices.state === 'hasValue') {
      return sumOutgoing.reduce((acc, b) => {
        const price = tokenPrices.contents[b.token.coingeckoId] || 0
        return acc + balanceToFloat(b) * price
      }, 0)
    }
    return undefined
  }, [sumOutgoing, tokenPrices])

  const signedCount = Object.values(t.approvals).filter(Boolean).length
  const txIcon =
    t.decoded.type === TransactionType.Transfer ? (
      <ArrowUp />
    ) : t.decoded.type === TransactionType.MultiSend ? (
      <Share2 />
    ) : (
      <List />
    )

  const tokenBreakdown = sumOutgoing.map(b => `${balanceToFloat(b)} ${b.token.symbol}`).join(' + ')
  return (
    <div
      onClick={onClick}
      className={css`
        display: grid;
        align-items: center;
        grid-template-columns: 44px 1fr auto auto;
        grid-template-rows: 16px 16px;
        grid-template-areas:
          'icon description tokenAmount executedInfo'
          'icon time usdAmount executedInfo';
        p {
          margin-top: 4px;
        }
      `}
    >
      <div
        className={css`
          grid-area: icon;
          display: grid;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border-radius: 100px;
          background-color: var(--color-backgroundLighter);
          svg {
            height: 15px;
            width: 15px;
            color: var(--color-primary);
          }
        `}
      >
        {txIcon}
      </div>
      <span
        css={{
          gridArea: 'description',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-offWhite)',
        }}
      >
        <p>{t.description}</p>
        {threshold !== signedCount && (
          <div
            className={css`
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 12px;
              background-color: var(--color-backgroundLighter);
              padding: 0 6px;
              font-size: 11px;
              color: var(--color-foreground);
              height: 16px;
              padding-top: 2px;
              cursor: inherit;
            `}
          >
            {signedCount}/{threshold}
          </div>
        )}
      </span>
      <p css={{ gridArea: 'time', fontSize: '14px', paddingTop: '4px' }}>{formattedHhMm(t.createdTimestamp)}</p>
      <p css={{ gridArea: 'tokenAmount', textAlign: 'right', color: 'var(--color-offWhite)', gridTemplateRows: '1fr' }}>
        {tokenBreakdown}
      </p>
      <div css={{ gridArea: 'usdAmount', textAlign: 'right', fontSize: '14px', paddingTop: '10px' }}>
        {sumPriceUsd ? (
          <>{formatUsd(sumPriceUsd)}</>
        ) : sumPriceUsd === 0 ? null : (
          <Skeleton.Surface css={{ height: '14px', minWidth: '30px' }} />
        )}
      </div>
      {t.executedTimestamp && (
        <a
          className={css`
            grid-area: executedInfo;
            margin-left: 24px;
          `}
          href="https://subscan.com/tx123"
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
        >
          <StatusCircle
            type={StatusCircleType.Success}
            circleDiameter="24px"
            iconDimentions={{ width: '11px', height: 'auto' }}
          />
        </a>
      )}
    </div>
  )
}

export default TransactionSummaryRow
