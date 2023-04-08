import Plant from '@components/Plant'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'

import { Step } from '.'

const NoVault = (props: { setStep: React.Dispatch<React.SetStateAction<Step>> }) => {
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
      `}
    >
      <Plant />
      <h1
        className={css`
          margin-top: 37px;
        `}
      >
        You don't have a vault yet
      </h1>
      <p
        className={css`
          margin-top: 16px;
          font-size: 16px;
        `}
      >
        Launch a multi-signature wallet for your organisation
      </p>
      <div>
        <Button
          onClick={() => {
            props.setStep('nameVault')
          }}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
          `}
          children={<h3>Create New Vault</h3>}
        />
      </div>
    </div>
  )
}

export default NoVault
