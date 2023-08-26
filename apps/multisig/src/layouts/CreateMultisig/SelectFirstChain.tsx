import { Chain } from '@domains/chains'
import { css } from '@emotion/css'
import { Button, Select } from '@talismn/ui'

const SelectFirstChain = (props: {
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
        grid-template-rows: 1fr;
        justify-items: center;
        align-content: center;
        text-align: center;
        padding: 48px;
      `}
    >
      <h1>Select a chain</h1>
      <p
        className={css`
          margin: 16px 0;
        `}
      >
        Choose the first chain to deploy your vault. You can always add more chains later.
      </p>
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
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

export default SelectFirstChain
