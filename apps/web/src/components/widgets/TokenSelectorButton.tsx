import Cryptoticon from '@components/recipes/Cryptoticon/Cryptoticon'
import TokenSelectorDialog from '@components/recipes/TokenSelectorDialog'
import { selectedBalancesState, selectedCurrencyState } from '@domains/balances'
import type { IToken } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Button } from '@talismn/ui'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export type TokenSelectorProps<T extends IToken | string> = {
  tokens: T[]
  selectedToken: T | undefined
  onChangeToken: (token: T) => unknown
}

const TokenSelectorButton = <T extends IToken | string>(props: TokenSelectorProps<T>) => {
  const [tokenSelectorDialogOpen, setTokenSelectorDialogOpen] = useState(false)
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))

  const tokensWithBalance = useMemo(
    () =>
      props.tokens.map(x => {
        const balance = balances.find(
          typeof x === 'string' ? y => y.token?.symbol.toLowerCase() === x.toLowerCase() : { id: x.id }
        )
        const free = Decimal.fromPlanck(balance.sum.planck.free, balance.each.at(0)?.decimals ?? 9)
        const symbol = typeof x === 'string' ? x : x.symbol

        return {
          token: x,
          symbol,
          logo:
            balance.each.at(0)?.token?.logo ?? `https://token-resources.vercel.app/tokens/${symbol.toUpperCase()}.png`,
          free,
          freeFiat: balance.sum.fiat(currency).free,
        }
      }),
    [balances, currency, props.tokens]
  )
  const selectedToken = useMemo<{ symbol: string; logo?: string }>(
    () =>
      typeof props.selectedToken === 'string'
        ? balances.find(x => x.token?.symbol.toLowerCase() === props.selectedToken?.toString().toLowerCase()).each.at(0)
            ?.token ?? { symbol: props.selectedToken, logo: undefined }
        : (props.selectedToken as IToken),
    [balances, props.selectedToken]
  )

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
                  currency,
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
