import { Select } from '@talismn/ui'
import { BaseToken } from '../domains/chains'

type Props = {
  tokens: BaseToken[]
  selectedToken: BaseToken | undefined
  onChange: (token: BaseToken) => void
}

const TokensSelect: React.FC<Props> = ({ onChange, selectedToken, tokens }) => (
  <Select
    value={selectedToken?.id}
    placeholder="Select a token"
    width="100%"
    onChange={id => onChange(tokens.find(t => t.id === id) as BaseToken)}
    css={{
      figure: {
        div: { height: 40, width: 40 },
      },
    }}
  >
    {tokens.map(token => (
      <Select.Option
        key={token.id}
        value={token.id}
        leadingIcon={
          <div css={{ width: 40, height: 40 }}>
            <img src={token.logo} alt={token.symbol} />
          </div>
        }
        headlineText={token.symbol}
      />
    ))}
  </Select>
)

export default TokensSelect
