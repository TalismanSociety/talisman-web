import { selectedCurrencyState } from '@/domains/balances'
import { useFastBalance, type UseFastBalanceProps } from '@/hooks/useFastBalance'
import type { Decimal } from '@talismn/math'
import { AlertDialog, Clickable, ListItem, SearchBar, Select, Skeleton, Surface } from '@talismn/ui'
import { Globe } from '@talismn/web-icons'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

type TokenSelectDialogItemProps = {
  code: string
  name: string
  chain: string
  iconSrc: string
  rates?: number
  balanceFetcher?: UseFastBalanceProps
  defaultBalanceDecimal?: Decimal
  onClick: () => unknown
}

const TokenSelectDialogItem = (props: TokenSelectDialogItemProps) => {
  const fastBalance = useFastBalance(props.balanceFetcher)
  const currency = useRecoilValue(selectedCurrencyState)

  const value = useMemo(() => {
    if (props.rates === undefined) return null
    const balance = fastBalance?.balance ?? props.defaultBalanceDecimal
    if (balance === undefined) return <Skeleton.Surface className="ml-auto h-[18px] w-[50px]" />
    return (props.rates * balance.toNumber()).toLocaleString(undefined, { currency, style: 'currency' })
  }, [currency, fastBalance, props.defaultBalanceDecimal, props.rates])

  const balanceUI = useMemo(() => {
    const balance = fastBalance?.balance ?? props.defaultBalanceDecimal
    if (balance === undefined) return <Skeleton.Surface className="h-[21px] w-[70px]" />
    return balance.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }, [fastBalance?.balance, props.defaultBalanceDecimal])

  return (
    <Clickable.WithFeedback onClick={props.onClick}>
      <Surface className="gap-[4px] sm:gap-[8px] grid grid-cols-3 p-[16px] rounded-[8px] w-full">
        <ListItem
          className="!w-full !p-0"
          css={{ flex: 1, padding: 0 }}
          leadingContent={
            <img
              src={props.iconSrc}
              className="w-[24px] h-[24px] min-w-[24px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full"
            />
          }
          headlineContent={<span className="text-[14px]">{props.code}</span>}
          supportingContent={<span className="text-[12px]">{props.name}</span>}
        />
        <ListItem
          className="!w-full !p-0"
          headlineContent={<span className="text-[12px] sm:text-[14px]">{props.chain}</span>}
        />
        {props.balanceFetcher || props.defaultBalanceDecimal ? (
          <ListItem
            css={{ flex: 1, padding: 0, textAlign: 'end' }}
            headlineContent={balanceUI}
            supportingContent={value}
          />
        ) : null}
      </Surface>
    </Clickable.WithFeedback>
  )
}

export type Token = Omit<TokenSelectDialogItemProps, 'onClick'> & { id: string; chainId: any }

export type TokenSelectDialogProps = {
  chains: Array<{ id: string; name: string; iconSrc: string }>
  tokens: Token[]
  onRequestDismiss: () => unknown
  onSelectToken: (token: Token) => unknown
}

export const TokenSelectDialog = (props: TokenSelectDialogProps) => {
  const [search, setSearch] = useState('')
  const [chain, setChain] = useState<string>()

  const filteredTokens = useMemo(
    () =>
      props.tokens
        .filter(token => chain === undefined || token.chainId === chain)
        .filter(token => {
          const query = search.trim().toLowerCase()

          if (query === '') {
            return true
          }

          return [token.code, token.name, token.chain].some(string => string.toLowerCase().includes(query))
        }),
    [props.tokens, chain, search]
  )

  return (
    <AlertDialog
      title="Select from asset"
      targetWidth="60rem"
      onRequestDismiss={props.onRequestDismiss}
      css={{ marginTop: '10vh', maxHeight: '80vh', minHeight: '45vh' }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          marginBottom: '1.6rem',
          '@media(min-width: 46rem)': {
            flexDirection: 'row',
          },
        }}
      >
        <div css={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} css={{ width: '100%' }} />
        </div>
        <Select value={chain} onChangeValue={setChain} className="[&>button]:!rounded-[8px]">
          <Select.Option value={undefined} leadingIcon={<Globe />} headlineContent="All Networks" />
          {props.chains.map(chain => (
            <Select.Option
              key={chain.id}
              value={chain.id}
              leadingIcon={<img className="w-[24px] h-[24px] rounded-full" src={chain.iconSrc} />}
              headlineContent={chain.name}
            />
          ))}
        </Select>
      </div>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '60dvh', overflow: 'auto' }}>
        {filteredTokens.map((token, index) => (
          <TokenSelectDialogItem
            key={index}
            {...token}
            onClick={() => {
              props.onRequestDismiss()
              props.onSelectToken(token)
            }}
          />
        ))}
      </div>
    </AlertDialog>
  )
}

export default TokenSelectDialog
