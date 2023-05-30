import { css } from '@emotion/css'
import { Button, Select, TextInput } from '@talismn/ui'
import toSs52Address from '@util/toSs52Address'
import { useState } from 'react'

import { ChainSummary, supportedChains } from '../../../domain/chains'
import { ChooseChain, NameTransaction } from './generic-steps'

enum Step {
  Name,
  Chain,
  Details,
  Review,
}

const DetailsForm = (props: {
  destination: string
  amount: number
  setDestination: (d: string) => void
  setAmount: (a: number) => void
  onBack: () => void
  onNext: () => void
}) => {
  return (
    <>
      <h1>Transaction details</h1>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <div css={{ display: 'flex', width: '100%', gap: '12px' }}>
          <div
            className={css`
              display: 'flex';
              flex-grow: 1;
              align-items: center;
            `}
          >
            <TextInput
              className={css`
                font-size: 18px !important;
              `}
              placeholder="0 DOT"
              leadingSupportingText={'$234.00 USD'}
              leadingLabel={'Amount to send'}
              trailingLabel={'420 DOT'}
              value={props.amount}
              onChange={event => {
                const number = parseFloat(event.target.value)
                props.setAmount(isNaN(number) ? 0 : number)
              }}
            />
          </div>
          <div
            className={css`
              display: flex;
              height: 100%;
              align-items: center;
              justify-content: center;
              height: 95.5px;
              button {
                height: 51.5px;
                gap: 8px;
                div {
                  margin-top: 2px;
                }
                svg {
                  display: none;
                }
              }
            `}
          >
            <Select placeholder="Select token" value={'DOT'} {...props}>
              <Select.Item
                key={'DOT'}
                value={'DOT'}
                leadingIcon={
                  <div
                    className={css`
                      width: 24px;
                      height: auto;
                    `}
                  >
                    <img src={supportedChains[0]?.logo} alt={'DOT'} />
                  </div>
                }
                headlineText={'DOT'}
              />
            </Select>
          </div>
        </div>
      </div>
      <div
        className={css`
          margin-top: 64px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          leadingLabel={'Recipient'}
          placeholder="14JVAWDg9h2iMqZgmiRpvZd8aeJ3TvANMCv6V5Te4N4Vkbg5"
          value={props.destination}
          onChange={event => {
            props.setDestination(event.target.value)
          }}
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
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button disabled={toSs52Address(props.destination) === false} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </>
  )
}

const SendAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState(0)
  const [chain, setChain] = useState<ChainSummary>(supportedChains[0] as ChainSummary)
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        padding: 32px;
        height: 100%;
      `}
    >
      {step === Step.Name ? (
        <NameTransaction
          name={name}
          setName={setName}
          onCancel={props.onCancel}
          onNext={() => {
            setStep(Step.Chain)
          }}
        />
      ) : step === Step.Chain ? (
        <ChooseChain
          chain={chain}
          setChain={setChain}
          chains={supportedChains}
          onBack={() => setStep(Step.Name)}
          onNext={() => setStep(Step.Details)}
        />
      ) : step === Step.Details ? (
        <DetailsForm
          onBack={() => setStep(Step.Chain)}
          onNext={() => setStep(Step.Review)}
          destination={destination}
          amount={amount}
          setDestination={setDestination}
          setAmount={setAmount}
        />
      ) : null}
    </div>
  )
}

export default SendAction
