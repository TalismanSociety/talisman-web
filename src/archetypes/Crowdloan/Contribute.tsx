import { Account, Parachain } from '@archetypes'
import { ReactComponent as CheckCircle } from '@assets/icons/check-circle.svg'
import { ReactComponent as XCircle } from '@assets/icons/x-circle.svg'
import { Button, Field, MaterialLoader, Pendor, useModal } from '@components'
import { useCrowdloanContribution } from '@libs/crowdloans'
import { useActiveAccount, useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { multiplyBigNumbers } from '@talismn/util'
import { formatCurrency } from '@util/helpers'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

export type ContributeProps = {
  className?: string
  id?: string
}

export default function Contribute({ className, id }: ContributeProps) {
  const { closeModal } = useModal()

  const { crowdloan } = useCrowdloanById(id)
  const { parachainDetails } = useParachainDetailsById(crowdloan?.parachain?.paraId)

  const [contributionAmount, setContributionAmount] = useState('')
  const updateContributionAmount = useCallback(value => setContributionAmount(value.replace(/[^.\d]/g, '')), [])
  const { address } = useActiveAccount()
  const [verifier, setVerifier] = useState()

  const { contribute, status, explorerUrl, error } = useCrowdloanContribution(
    crowdloan?.parachain?.paraId,
    contributionAmount,
    address
  )

  const modalState = useMemo(() => {
    if (status === 'SUCCESS') return 'Success'
    if (status === 'FAILED') return 'Failed'
    if (status === 'PROCESSING') return 'InProgress'
    return 'ContributeTo'
  }, [status])
  const ModalComponent = ModalComponents[modalState] || null

  if (!ModalComponent) return null
  return (
    <ModalComponent
      {...{
        crowdloan,
        parachainDetails,

        contributionAmount,
        updateContributionAmount,
        verifier,
        setVerifier,

        contribute,
        status,
        explorerUrl,
        error,

        closeModal,
      }}
    />
  )
}

const ContributeTo = styled(
  ({
    className,
    crowdloan,
    parachainDetails,

    contributionAmount,
    updateContributionAmount,
    verifier,
    setVerifier,

    contribute,
    status,
    error,

    closeModal,
  }) => {
    const { price: tokenPrice, loading: priceLoading } = useTokenPrice('KSM')
    const usd = useMemo(
      () => !Number.isNaN(Number(contributionAmount)) && multiplyBigNumbers(contributionAmount, tokenPrice),
      [contributionAmount, tokenPrice]
    )

    return (
      <form
        className={className}
        onSubmit={event => {
          event.preventDefault()
          contribute()
        }}
      >
        <header>
          <h2>Contribute To</h2>
          <Parachain.Asset className="logo" id={parachainDetails?.id} type="logo" />
          <h3>{parachainDetails?.name}</h3>
        </header>
        <main>
          <div className="row split">
            <div className="amount-input">
              <Field.Input
                value={contributionAmount}
                onChange={updateContributionAmount}
                dim
                suffix="KSM"
                disabled={status === 'VALIDATING'}
              />
              <div className="info-row usd-and-error">
                <Pendor prefix={!usd && '-'} require={!priceLoading}>
                  {usd && formatCurrency(usd)}
                </Pendor>
                {error && <span className="error">{error}</span>}
              </div>
            </div>
            <div className="account-switcher-pill">
              <Account.Button narrow />
            </div>
          </div>

          {crowdloan?.verifier && (
            <div className="row">
              <div className="verifier-input">
                <Field.Input
                  value={verifier}
                  onChange={setVerifier}
                  dim
                  placeholder="Verifier Signature"
                  disabled={status === 'VALIDATING'}
                />
                <div className="info">
                  The hex-encoded verifier signature should be provided to you by the team running the crowdloan (based
                  on the information you provide). Please go to the {parachainDetails?.name} website for more info.
                </div>
              </div>
            </div>
          )}
        </main>
        <footer>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            primary
            loading={status === 'VALIDATING'}
            disabled={error === 'Account balance too low'}
          >
            Contribute
          </Button>
        </footer>
      </form>
    )
  }
)`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 2.4rem;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 1.6rem;
    user-select: none;
  }
  > header > h3 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 4.8rem;
  }

  > main > .row {
    display: flex;
    flex-direction: column;
    margin-bottom: 3.4rem;
    &:last-child {
      margin-bottom: 4rem;
    }
  }
  > main > .row.split {
    flex-direction: row;
    align-items: flex-start;
  }
  > main > .row > .amount-input {
    width: 100%;
    flex: 2 0 0%;
    margin-right: 1.6rem;

    input {
      font-size: 3.2rem;
      font-weight: 600;
      padding: 0.4rem 7rem 0.4rem 2.4rem;

      .suffix {
        right: 2.4rem;
      }
    }

    > .info-row {
      width: 100%;
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      color: rgb(${({ theme }) => theme?.mid});
      font-size: var(--font-size-small);

      .error {
        color: var(--color-status-error);
        text-align: right;
        margin-left: 1rem;
        max-width: 75%;
      }
    }

    > .info-row.usd-and-error {
      min-height: 2.2rem;
    }
  }
  > main > .row > .account-switcher-pill {
    flex: 0 0 0%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5.9rem;
    padding: 0 0.5rem;
    border-radius: 4rem;
    background: rgb(${({ theme }) => theme?.background});
    color: rgb(${({ theme }) => theme?.foreground});
    box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.1);
  }
  > main > .row > .verifier-input {
    .field {
      margin-bottom: 1.6rem;

      input {
        font-size: 1.8rem;
        &::placeholder {
          color: #999;
        }
      }
    }
    .info {
      color: #999;
      font-size: 1.4rem;
      line-height: 1.8rem;
    }
  }

  > footer {
    display: flex;
    > * {
      flex: 1 0 0%;
      &:not(:last-child) {
        margin-right: 1.6rem;
      }
    }
  }
`

const InProgress = styled(({ className, explorerUrl, closeModal }) => (
  <div className={className}>
    <header>
      <h2>In Progress</h2>
      <MaterialLoader className="logo" />
    </header>
    <main>
      <div>Your transaction is in progress. This may take a few minutes to confirm</div>
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          View on Polkadot.js
        </a>
      )}
    </main>
    <footer>
      <Button onClick={closeModal}>Close</Button>
    </footer>
  </div>
))`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 8.2rem;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 8.2rem;
    color: var(--color-primary);
    user-select: none;
  }

  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;

    div:first-child {
      margin-bottom: 4rem;
    }
    a {
      display: block;
      color: #f46545;
      background: #fbe2dc;
      border-radius: 5.6rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
    }
  }

  > footer {
    display: flex;
    justify-content: center;

    button {
      min-width: 27.8rem;
    }
  }
`

const Success = styled(({ className, explorerUrl, closeModal }) => (
  <div className={className}>
    <header>
      <h2>Success</h2>
      <CheckCircle className="logo" />
    </header>
    <main>
      <div>Your transaction was successful. Thank you for your contribution</div>
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          View on Polkadot.js
        </a>
      )}
    </main>
    <footer>
      <Button onClick={closeModal}>Close</Button>
    </footer>
  </div>
))`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 8.2rem;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 8.2rem;
    color: var(--color-primary);
    user-select: none;
  }

  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;

    div:first-child {
      margin-bottom: 4rem;
    }
    a {
      display: block;
      color: #f46545;
      background: #fbe2dc;
      border-radius: 5.6rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
    }
  }

  > footer {
    display: flex;
    justify-content: center;

    button {
      min-width: 27.8rem;
    }
  }
`

const Failed = styled(({ className, explorerUrl, error, closeModal }) => (
  <div className={className}>
    <header>
      <h2>Failed</h2>
      <XCircle className="logo" />
    </header>
    <main>
      <div>
        <div>Your transaction was not successful.</div>
        {error && <div className="error">{error}</div>}
      </div>
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          View on Polkadot.js
        </a>
      )}
    </main>
    <footer>
      <Button onClick={closeModal}>Close</Button>
    </footer>
  </div>
))`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 8.2rem;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 8.2rem;
    color: var(--color-primary);
    user-select: none;
  }

  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;

    > div:first-child {
      margin-bottom: 4rem;
      text-align: center;
    }
    .error {
      color: var(--color-status-error);
    }
    a {
      display: block;
      color: #f46545;
      background: #fbe2dc;
      border-radius: 5.6rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
    }
  }

  > footer {
    display: flex;
    justify-content: center;

    button {
      min-width: 27.8rem;
    }
  }
`

const ModalComponents: { [key: string]: typeof ContributeTo } = { ContributeTo, InProgress, Success, Failed }
