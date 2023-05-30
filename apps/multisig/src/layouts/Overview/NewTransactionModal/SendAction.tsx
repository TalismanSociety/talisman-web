import { css } from '@emotion/css'
import { useState } from 'react'

import { ChainSummary, supportedChains } from '../../../domain/chains'
import { ChooseChain, NameTransaction } from './generic-steps'

enum Step {
  Name,
  Chain,
  Details,
  Review,
}

const SendAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
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
      ) : null}
    </div>
  )
}

export default SendAction
