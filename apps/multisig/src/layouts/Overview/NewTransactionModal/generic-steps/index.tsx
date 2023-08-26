import { Chain } from '@domains/chains'
import { css } from '@emotion/css'
import { Button, Select, TextInput } from '@talismn/ui'

export const NameTransaction = (props: {
  onCancel: () => void
  name: string
  setName: (s: string) => void
  onNext: () => void
}) => {
  return (
    <>
      <h1>What's this transaction for?</h1>
      <span css={{ paddingTop: '24px' }}>Give your transaction a description</span>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder='e.g. "Reimburse transaction fees"'
          value={props.name}
          onChange={event => props.setName(event.target.value)}
        />
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 490px;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onCancel} children={<h3>Cancel</h3>} variant="outlined" />
        <Button disabled={props.name.length === 0} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </>
  )
}

export const ChooseChain = (props: {
  onNext: () => void
  onBack: () => void
  setChain: React.Dispatch<React.SetStateAction<Chain>>
  chain: Chain
  chains: Chain[]
}) => {
  return (
    <>
      <h1>Choose a network</h1>
      <span css={{ paddingTop: '24px' }}>Choose a network for your transaction</span>
      <div css={{ width: '490px', marginTop: '48px' }}>
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
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 490px;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </>
  )
}
