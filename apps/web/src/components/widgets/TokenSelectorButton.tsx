import Cryptoticon from '@components/recipes/Cryptoticon/Cryptoticon'
import TokenSelectorDialog from '@components/recipes/TokenSelectorDialog'
import { balancesState } from '@domains/balances/recoils'
import type { IToken } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Button } from '@talismn/ui'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

export type TokenSelectorProps<T extends IToken | string> = {
  tokens: T[]
  selectedToken: T | undefined
  onChangeToken: (token: T) => unknown
}

const TokenSelectorButton = <T extends IToken | string>(props: TokenSelectorProps<T>) => {
  const [tokenSelectorDialogOpen, setTokenSelectorDialogOpen] = useState(false)
  const balances = useRecoilValue(balancesState)

  const tokensWithBalance = useMemo(
    () =>
      props.tokens.map(x => {
        const balance = balances.find(typeof x === 'string' ? y => y.token?.symbol === x : { id: x.id })
        const free = Decimal.fromPlanck(balance.sum.planck.free, balance.each.at(0)?.decimals ?? 9)
        return {
          token: x,
          symbol: typeof x === 'string' ? x : x.symbol,
          logo: balance.each.at(0)?.token?.logo,
          free,
          freeFiat: balance.sum.fiat('usd').free,
        }
      }),
    [balances, props.tokens]
  )

  const selectedToken = useMemo<IToken | undefined>(
    () =>
      typeof props.selectedToken === 'string'
        ? balances.find(x => x.token?.symbol === props.selectedToken).each.at(0)?.token ?? undefined
        : props.selectedToken,
    [balances, props.selectedToken]
  )

  console.debug(selectedToken)

  return (
    <>
      {selectedToken === undefined ? (
        <Button variant="surface" onClick={() => setTokenSelectorDialogOpen(true)}>
          Select token
        </Button>
      ) : (
        <Button
          variant="surface"
          onClick={() => setTokenSelectorDialogOpen(true)}
          leadingIcon={<Cryptoticon src={selectedToken.logo} />}
        >
          {selectedToken.symbol}
        </Button>
      )}
      {tokenSelectorDialogOpen && (
        <TokenSelectorDialog onRequestDismiss={() => setTokenSelectorDialogOpen(false)}>
          {tokensWithBalance
            .sort((a, b) => b.freeFiat - a.freeFiat || b.free.planck.cmp(a.free.planck))
            .map((x, index) => (
              <TokenSelectorDialog.Item
                key={index}
                logoSrc={x.logo}
                name={x.symbol}
                amount={x.free.toHuman()}
                fiatAmount={x.freeFiat.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'usd',
                  compactDisplay: 'short',
                })}
                onClick={() => {
                  props.onChangeToken(x.token)
                  setTokenSelectorDialogOpen(false)
                }}
              />
            ))}
        </TokenSelectorDialog>
      )}
    </>
  )
}

export default TokenSelectorButton
