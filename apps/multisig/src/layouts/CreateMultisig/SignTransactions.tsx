import { css } from '@emotion/css'
import { Check, Send } from '@talismn/icons'
import { CircularProgressIndicator, IconButton } from '@talismn/ui'
import { device } from '@util/breakpoints'

import { CreateTransactionsStatus } from '.'

enum StepStatus {
  Done,
  InProgress,
  NotStarted,
}

const Step = ({ name, description, status }: { name: string; description: string; status: StepStatus }) => {
  const icon =
    status === StepStatus.Done ? <Check /> : status === StepStatus.InProgress ? <CircularProgressIndicator /> : <Send />
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
          {icon}
        </IconButton>
      </div>
      <div
        className={css`
          display: grid;
          gap: 4px;
          ${!(status === StepStatus.InProgress) ? 'color: var(--color-dim)' : ''}
          ${status === StepStatus.InProgress ? 'p:nth-child(1) { color: white; }' : ''}
        `}
      >
        <p>{name}</p>
        <p>{description}</p>
      </div>
    </div>
  )
}

const SignTransactions = (props: { status: CreateTransactionsStatus; onDone: () => void }) => {
  const createProxyStatus =
    props.status === CreateTransactionsStatus.CreatingProxy ? StepStatus.InProgress : StepStatus.Done
  const transferProxyStatus =
    props.status === CreateTransactionsStatus.TransferringProxy ? StepStatus.InProgress : StepStatus.NotStarted
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
      <Step name="Create proxy" description="Create a pure proxy for your Vault." status={createProxyStatus} />
      <Step name="Transfer proxy" description="Assign the proxy to your Vault." status={transferProxyStatus} />
    </div>
  )
}

export default SignTransactions
