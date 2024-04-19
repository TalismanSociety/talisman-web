import { AlertDialog, Clickable, ListItem, SearchBar, Select, Surface } from '@talismn/ui'
import { Globe } from '@talismn/web-icons'
import { useMemo, useState } from 'react'

type TokenSelectDialogItemProps = {
  code: string
  name: string
  chain: string
  iconSrc: string
  amount: string
  fiatAmount: string
  onClick: () => unknown
}

const TokenSelectDialogItem = (props: TokenSelectDialogItemProps) => (
  <Clickable.WithFeedback onClick={props.onClick}>
    <Surface
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.8rem',
        borderRadius: '0.8rem',
        padding: '1.6rem',
      }}
    >
      <ListItem
        css={{ padding: 0 }}
        leadingContent={<img src={props.iconSrc} css={{ width: '4rem', height: '4rem' }} />}
        headlineContent={props.code}
        supportingContent={props.name}
      />
      <ListItem css={{ padding: 0 }} headlineContent={props.chain} />
      <ListItem
        css={{ padding: 0, textAlign: 'end' }}
        headlineContent={props.amount}
        supportingContent={props.fiatAmount}
      />
    </Surface>
  </Clickable.WithFeedback>
)

type Token = Omit<TokenSelectDialogItemProps, 'onClick'> & { id: string; chainId: string }

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
    <AlertDialog title="Select from asset" targetWidth="60rem" onRequestDismiss={props.onRequestDismiss}>
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
        <Select value={chain} onChangeValue={setChain}>
          <Select.Option value={undefined} leadingIcon={<Globe />} headlineContent="All networks" />
          {props.chains.map(chain => (
            <Select.Option
              key={chain.id}
              value={chain.id}
              leadingIcon={<img src={chain.iconSrc} css={{ width: '2.4rem', height: '2.4rem' }} />}
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
