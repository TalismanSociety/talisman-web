import { Account, Parachain } from '@archetypes'
import { ReactComponent as CheckCircle } from '@assets/icons/check-circle.svg'
import { ReactComponent as XCircle } from '@assets/icons/x-circle.svg'
import { Button, DesktopRequired, Field, MaterialLoader, Pendor, useModal } from '@components'
import { useCrowdloanContribute } from '@libs/crowdloans'
import { useActiveAccount, useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { multiplyBigNumbers } from '@talismn/util'
import { isMobileBrowser } from '@util/helpers'
import { formatCurrency, truncateString } from '@util/helpers'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const updateContributionAmount = useCallback(
    value =>
      setContributionAmount(
        value
          // remove anything which isn't a number or a decimal point
          .replace(/[^.\d]/g, '')
          // remove any decimal points after the first decimal point
          .replace(/\./g, (match: string, offset: number, string: string) =>
            match === '.' ? (string.indexOf('.') === offset ? '.' : '') : ''
          )
      ),
    []
  )
  const { address } = useActiveAccount()
  const [verifier, setVerifier] = useState()

  const { contribute, status, explorerUrl, txFee, error } = useCrowdloanContribute(
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

  if (isMobileBrowser()) return <DesktopRequired />
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
        txFee,
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
    txFee,
    error,

    closeModal,
  }) => {
    const { t } = useTranslation()
    const { price: tokenPrice, loading: priceLoading } = useTokenPrice('KSM')
    const usd = useMemo(
      () => !Number.isNaN(Number(contributionAmount)) && multiplyBigNumbers(contributionAmount, tokenPrice),
      [contributionAmount, tokenPrice]
    )

    const txFeeUsd = useMemo(
      () => !Number.isNaN(Number(txFee?.fee)) && multiplyBigNumbers(txFee?.fee, tokenPrice),
      [txFee?.fee, tokenPrice]
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
          <h2>{t('Contribute to')}</h2>
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
                type="text"
                inputMode="numeric"
                pattern="[.\d]*"
                suffix="KSM"
                disabled={status === 'VALIDATING'}
              />
              <div className="info-row usd-and-error">
                <Pendor prefix={!usd && '-'} require={!priceLoading}>
                  {usd && truncateString(formatCurrency(usd), '$9,999,999,999.99'.length)}
                </Pendor>
                {error && <span className="error">{error}</span>}
              </div>
            </div>
            <div className="switcher-column">
              <Account.Button narrow showValue showBuy closeParent={closeModal} fixedDropdown />
              <div className="tx-fee">
                <span>
                  {txFeeUsd && `${t('Fee')}: ${truncateString(formatCurrency(txFeeUsd), '$9,999,999,999.99'.length)} `}
                </span>
                {/* As per agreement, removing txFee in native token for now. */}
                {/* <Pendor prefix={txFee ? ' = ' : ''} suffix={txFee ? 'KSM' : '-'} require={!txFee?.loading}>
                  <span>{txFee ? `${shortNumber(txFee.fee)}` : null}</span>
                </Pendor> */}
              </div>
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
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            primary
            loading={status === 'VALIDATING'}
            disabled={error === t('Account balance too low') || !contributionAmount}
          >
            {t('Contribute')}
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
  > main > .row > .switcher-column {
    > .account-switcher-pill {
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
    // .account-picker {
    //   position: fixed;
    //   top: auto;
    //   left: auto;
    // }
    > .tx-fee {
      display: flex;
      align-items: center;
      justify-content: end;
      white-space: pre;
      width: 100%;
      margin-top: 1rem;
      text-align: right;
      color: rgb(${({ theme }) => theme?.mid});
      font-size: var(--font-size-small);
      min-height: 2.2rem;
    }
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

const InProgress = styled(({ className, explorerUrl, closeModal }) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('inProgress.header')}</h2>
        <MaterialLoader className="logo" />
      </header>
      <main>
        <div>{t('inProgress.description')}</div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('inProgress.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button onClick={closeModal}>{t('inProgress.secondaryCta')}</Button>
      </footer>
    </div>
  )
})`
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

const Success = styled(({ className, explorerUrl, closeModal }) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('success.header')}</h2>
        <CheckCircle className="logo" />
      </header>
      <main>
        <div>{t('success.description')}</div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('success.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button primary to="/" onClick={closeModal}>
          {t('success.secondaryCta')}
        </Button>
      </footer>
    </div>
  )
})`
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

const Failed = styled(({ className, explorerUrl, error, closeModal }) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('failed.header')}</h2>
        <XCircle className="logo" />
      </header>
      <main>
        <div>
          <div>{t('failed.description')}</div>
          {error && <div className="error">{error}</div>}
        </div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('failed.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button onClick={closeModal}>{t('failed.secondaryCta')}</Button>
      </footer>
    </div>
  )
})`
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
