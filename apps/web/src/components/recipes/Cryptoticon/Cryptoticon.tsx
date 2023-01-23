import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { useTheme } from '@emotion/react'
import { useChaindata, useTokens } from '@talismn/balances-react'
import { PropsWithChildren, createContext, useContext } from 'react'

export type CryptoticonProps = {
  src?: string
  alt?: string
  size?: string | number
  loading?: boolean
}

const CryptoticonContext = createContext({ tokens: {} as ReturnType<typeof useTokens> })

const Cryptoticon = ({ src, alt, size = '6.4rem', loading }: CryptoticonProps) => {
  const theme = useTheme()

  const css = { width: size, height: size, borderRadius: '50%' }

  if (loading) {
    return (
      <div
        css={{
          ...css,
          backgroundColor: theme.color.foreground,
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgressIndicator size="100%" />
      </div>
    )
  }
  return <img alt={alt} src={src} css={css} />
}

export type TokenProps = {
  id: string
  size?: string | number
}

const Token = ({ id, size = '6.4rem' }: TokenProps) => {
  const { tokens } = useContext(CryptoticonContext)
  const token = tokens[id]

  if (Object.keys(tokens).length === 0) {
    return <Cryptoticon loading />
  }

  if (token === undefined) {
    return (
      <Cryptoticon
        alt={id}
        src="https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg"
      />
    )
  }

  return <Cryptoticon alt={token.symbol} src={token.logo} />
}

export default Object.assign(Cryptoticon, {
  Provider: (props: PropsWithChildren) => {
    const chaindata = useChaindata()
    const tokens = useTokens(chaindata)

    return <CryptoticonContext.Provider value={{ tokens }}>{props.children}</CryptoticonContext.Provider>
  },
  Token,
})
