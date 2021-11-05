import { Account, Parachain } from '@archetypes'
import { ReactComponent as CheckCircle } from '@assets/icons/check-circle.svg'
import { ReactComponent as XCircle } from '@assets/icons/x-circle.svg'
import { Button, DesktopRequired, Field, MaterialLoader, Pendor, useModal } from '@components'
import { ContributeEvent, acalaOptions, useCrowdloanContribute } from '@libs/crowdloans'
import { useActiveAccount, useCrowdloanById } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { multiplyBigNumbers } from '@talismn/util'
import { isMobileBrowser } from '@util/helpers'
import { formatCurrency, truncateString } from '@util/helpers'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export type ContributeProps = {
  className?: string
  id?: string
}

export default function Contribute({ className, id }: ContributeProps) {
  const { closeModal } = useModal()

  const [contributeState, dispatch] = useCrowdloanContribute()

  const { crowdloan } = useCrowdloanById(id)
  useEffect(() => {
    if (!crowdloan) return

    const relayChainId = crowdloan.relayChainId
    const parachainId = Number(crowdloan.parachain.paraId.split('-').slice(-1)[0])

    dispatch(ContributeEvent.initialize({ relayChainId, parachainId }))
  }, [crowdloan, dispatch])

  if (isMobileBrowser()) return <DesktopRequired />

  return contributeState.match({
    Initializing: () => <Loading />,
    Ready: props => (
      <ContributeTo
        {...{
          className,
          closeModal,
          dispatch,
          ...props,
        }}
      />
    ),
    ContributionSubmitting: props => (
      <InProgress
        {...{
          className,
          closeModal,
          ...props,
        }}
      />
    ),
    ContributionSuccess: props => (
      <Success
        {...{
          className,
          closeModal,
          ...props,
        }}
      />
    ),
    ContributionFailed: props => (
      <Failed
        {...{
          className,
          closeModal,
          ...props,
        }}
      />
    ),
    _: () => null,
  })
}

const ContributeTo = styled(
  ({
    className,
    closeModal,
    dispatch,

    relayChainId,
    relayNativeToken,
    parachainId,
    parachainName,

    contributionAmount,
    email,

    txFee,
    validationError,
    submissionRequested,
  }) => {
    const { t } = useTranslation()
    const { t: tError } = useTranslation('errors')

    const { price: tokenPrice, loading: priceLoading } = useTokenPrice(relayNativeToken)
    const usd = useMemo(
      () => !Number.isNaN(Number(contributionAmount)) && multiplyBigNumbers(contributionAmount, tokenPrice),
      [contributionAmount, tokenPrice]
    )

    const txFeeUsd = useMemo(
      () => !Number.isNaN(Number(txFee)) && multiplyBigNumbers(txFee, tokenPrice),
      [txFee, tokenPrice]
    )

    const { address } = useActiveAccount()
    useEffect(() => {
      dispatch(ContributeEvent.setAccount(address))
    }, [dispatch, address])

    return (
      <form
        className={className}
        onSubmit={event => {
          event.preventDefault()
          dispatch(ContributeEvent.contribute)
        }}
      >
        <header>
          <h2>{t('Contribute to')}</h2>
          <Parachain.Asset className="logo" id={`${relayChainId}-${parachainId}`} type="logo" />
          <h3>{parachainName}</h3>
        </header>
        <main>
          <div className="row split">
            <div className="amount-input">
              <Field.Input
                value={contributionAmount}
                onChange={(amount: string) => dispatch(ContributeEvent.setContributionAmount(amount))}
                dim
                type="text"
                inputMode="numeric"
                pattern="[.\d]*"
                suffix={relayNativeToken}
                disabled={submissionRequested}
              />
              <div className="info-row usd-and-error">
                <Pendor prefix={!usd && '-'} require={!priceLoading}>
                  {usd && truncateString(formatCurrency(usd), '$9,999,999,999.99'.length)}
                </Pendor>
                {validationError && (
                  <span className="error">{tError(validationError.i18nCode, validationError.vars)}</span>
                )}
              </div>
            </div>
            <div className="switcher-column">
              <Account.Button
                narrow
                showValue
                showBuy
                closeParent={closeModal}
                fixedDropdown
                parachainId={relayChainId}
              />
              <div className="tx-fee">
                <Pendor suffix={txFee === null ? '-' : null} require={txFee !== undefined}>
                  {txFee ? (
                    <>
                      <span>
                        {`${t('Fee')}: ${truncateString(formatCurrency(txFeeUsd), '$9,999,999,999.99'.length)}`}
                      </span>
                      {/* <span>{` = ${shortNumber(txFee)}${relayNativeToken}`}</span> */}
                    </>
                  ) : null}
                </Pendor>
              </div>
            </div>
          </div>

          {relayChainId === acalaOptions.relayId && parachainId === acalaOptions.parachainId && (
            <div className="row">
              <div className="email-input">
                <Field.Input
                  value={email}
                  onChange={(email: string) => dispatch(ContributeEvent.setEmail(email))}
                  dim
                  type="email"
                  placeholder="Email (optional)"
                  disabled={submissionRequested}
                />
                <div className="info">
                  All contributions made to Acala's{' '}
                  <a
                    href="https://medium.com/acalanetwork/acala-liquid-crowdloan-dot-lcdot-launch-on-polkadot-f28d8f561157#4080"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    liquid crowdloan
                  </a>{' '}
                  via the Talisman dashboard are elligible for lcDOT rewards.
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
            loading={submissionRequested}
            disabled={
              !contributionAmount ||
              Number(contributionAmount) === 0 ||
              validationError?.i18nCode === 'Account balance too low' ||
              validationError?.i18nCode === 'A minimum of {{minimum}} {{token}} is required'
            }
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
  > main > .row > .email-input,
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

      a {
        color: var(--color-primary);
      }
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

const InProgress = styled(({ className, closeModal, explorerUrl }) => {
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

const Success = styled(({ className, closeModal, explorerUrl }) => {
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

const Failed = styled(({ className, closeModal, explorerUrl, error }) => {
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

const Loading = styled(MaterialLoader)`
  font-size: 6.4rem;
  margin: 4rem auto;
  color: var(--color-primary);
  user-select: none;
`
