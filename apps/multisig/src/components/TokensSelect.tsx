import { Select } from '@talismn/ui'
import { BaseToken } from '../domains/chains'

type Props = {
  leadingLabel?: React.ReactNode
  tokens: BaseToken[]
  selectedToken: BaseToken | undefined
  onChange: (token: BaseToken) => void
}

const TokensSelect: React.FC<Props> = ({ leadingLabel, onChange, selectedToken, tokens }) => (
  <div css={{ display: 'flex', gap: 8, flexDirection: 'column', width: '100%' }}>
    {leadingLabel !== undefined && typeof leadingLabel === 'string' ? (
      <label
        css={({ color }) => ({
          color: color.lightGrey,
          fontSize: 12,
        })}
      >
        {leadingLabel}
      </label>
    ) : (
      leadingLabel
    )}
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
      {tokens.map?.(token => (
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
  </div>
)

export default TokensSelect
