import { useRecoilValueLoadable } from 'recoil'
import { tokenPriceState } from '@domains/chains'
import { Balance } from '@domains/multisig'
import { balanceToFloat, formatUsd } from '../util/numbers'
import { css } from '@emotion/css'
import { Skeleton } from '@talismn/ui'

const AmountRow = ({ balance, hideIcon }: { balance: Balance; hideIcon?: boolean }) => {
  const price = useRecoilValueLoadable(tokenPriceState(balance.token))
  const balanceFloat = balanceToFloat(balance)
  return (
    <div
      className={css`
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--color-foreground);
      `}
    >
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{balanceFloat.toFixed(4)}</p>
      {!hideIcon && <img css={{ height: '20px' }} src={balance.token.logo} alt="token logo" />}
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{balance.token.symbol}</p>
      {price.state === 'hasValue' ? (
        <p css={{ fontSize: '18px', marginTop: '4px' }}>{`(${formatUsd(balanceFloat * price.contents.current)})`}</p>
      ) : (
        <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
      )}
    </div>
  )
}

export default AmountRow
