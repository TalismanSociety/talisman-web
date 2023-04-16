import { css } from '@emotion/css'
import { Check } from '@talismn/icons'
import { CircularProgressIndicator, IconButton } from '@talismn/ui'
import { device } from '@util/breakpoints'

const Step = (props: { name: string; description: string; completed: boolean }) => {
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 24px 1fr;
        grid-template-rows: 1fr;
        gap: 16px;
        width: 100%;
        text-align: left;
      `}
    >
      <div
        className={css`
          display: grid;
          align-content: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 675px;
          background-color: #292929;
        `}
      >
        <IconButton
          className={css`
            grid-area: 1 / 1 / 2 / 1;
          `}
          size="12px"
          contentColor={'#a5a5a5'}
        >
          {props.completed ? <Check /> : <CircularProgressIndicator />}
        </IconButton>
      </div>
      <div
        className={css`
          display: grid;
          gap: 4px;
          ${props.completed ? 'color: var(--color-dim)' : ''}
          ${!props.completed ? 'p:nth-child(1) { color: white; }' : ''}
        `}
      >
        <p>{props.name}</p>
        <p>{props.description}</p>
      </div>
    </div>
  )
}

const SignTransactions = (props: { proxyCreated: boolean; proxySetupCompleted: boolean }) => {
  return (
    <div
      className={css`
        display: grid;
        padding: 48px;
        @media ${device.lg} {
          padding: 80px 120px;
        }
        text-align: center;
        gap: 32px;
      `}
    >
      <h1>Create vault</h1>
      <p>
        Last step, you'll need to sign a couple transactions with your wallet to complete the creation of your Vault.
      </p>
      <Step name="Create proxy" description="Create a pure proxy for your Vault." completed={true} />
      <Step name="Transfer proxy" description="Assign the proxy to your Vault." completed={false} />
    </div>
  )
}

export default SignTransactions
