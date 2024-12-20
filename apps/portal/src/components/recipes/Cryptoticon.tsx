import type { PropsWithChildren } from 'react'
import { useTokens } from '@talismn/balances-react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { IconContext } from '@talismn/web-icons/utils'
import { createContext, useContext } from 'react'

export type CryptoticonProps = {
  src?: string
  alt?: string
  size?: string | number
  loading?: boolean
}

const CryptoticonContext = createContext({ tokens: {} as ReturnType<typeof useTokens> })

export const Cryptoticon = Object.assign(
  ({ src, alt, size: _size, loading }: CryptoticonProps) => {
    const surfaceColor = useSurfaceColor()

    const contextSize = useContext(IconContext).size
    const size = _size ?? contextSize ?? '6.4rem'

    const css = { width: size, height: size, borderRadius: '50%' }

    if (loading) {
      return (
        <div
          css={{
            ...css,
            backgroundColor: surfaceColor,
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
  },
  {
    Provider: (props: PropsWithChildren) => {
      const tokens = useTokens()

      return <CryptoticonContext.Provider value={{ tokens }}>{props.children}</CryptoticonContext.Provider>
    },
    Token,
  }
)

export type TokenProps = {
  id: string
  size?: string | number
}

function Token({ id, size = '6.4rem' }: TokenProps) {
  const { tokens } = useContext(CryptoticonContext)
  const token = tokens[id]

  if (Object.keys(tokens).length === 0) {
    return <Cryptoticon loading />
  }

  if (token === undefined) {
    return (
      <Cryptoticon
        size={size}
        alt={id}
        src="https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg"
      />
    )
  }

  return <Cryptoticon alt={token.symbol} src={token.logo} />
}
