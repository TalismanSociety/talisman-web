import { Select } from '@talismn/ui'
import { BaseToken } from '../domains/chains'
import { Balance } from '@talismn/balances'

type Props = {
  tokens: BaseToken[]
  selectedToken: BaseToken | undefined
  onChange: (token: BaseToken) => void
  balance?: Balance
}

const TokensSelect: React.FC<Props> = ({ onChange, selectedToken, tokens }) => (
  <Select
    value={selectedToken?.id}
    placeholder="Select a token"
    width={'100%'}
    onChange={id => onChange(tokens.find(t => t.id === id) as BaseToken)}
    css={{
      figure: {
        div: {
          height: '40px',
          width: '40px',
        },
      },
    }}
  >
    {tokens.map(token => (
      <Select.Option
        key={token.id}
        value={token.id}
        leadingIcon={
          <div
            css={{
              width: '40px',
              height: '40px',
            }}
          >
            <img src={token.logo} alt={token.symbol} />
          </div>
        }
        headlineText={token.symbol}
      />
    ))}
  </Select>
)

export default TokensSelect
