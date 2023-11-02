import { Chain } from '@domains/chains'
import { css } from '@emotion/css'
import { Select } from '@talismn/ui'
import { CancleOrNext } from './CancelOrNext'

const SelectChain = (props: {
  onNext: () => void
  onBack: () => void
  setChain: React.Dispatch<React.SetStateAction<Chain>>
  chain: Chain
  chains: Chain[]
}) => {
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 48px;
        width: 100%;
        max-width: 540px;
      `}
    >
      <div>
        <h1>Select a chain</h1>
        <p css={{ marginTop: 16, textAlign: 'center' }}>Select the chain for your Vault</p>
      </div>
      <Select
        placeholder="Select account"
        value={props.chain.squidIds.chainData}
        onChange={value => props.setChain(props.chains.find(chain => chain.squidIds.chainData === value) as Chain)}
        {...props}
      >
        {props.chains.map(chain => (
          <Select.Item
            key={chain.squidIds.chainData}
            value={chain.squidIds.chainData}
            leadingIcon={
              <div
                className={css`
                  width: 40px;
                  min-height: 47.5px;
                  height: auto;
                `}
              >
                <img src={chain.logo} alt={chain.chainName} />
              </div>
            }
            headlineText={chain.chainName}
            supportingText={chain.isTestnet ? 'Testnet' : ''}
          />
        ))}
      </Select>
      <CancleOrNext
        block
        cancel={{
          onClick: props.onBack,
          children: 'Back',
        }}
        next={{
          onClick: props.onNext,
        }}
      />
    </div>
  )
}

export default SelectChain
