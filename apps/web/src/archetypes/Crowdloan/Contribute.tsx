import { Parachain } from '@archetypes'
import { ReactComponent as XCircle } from '@assets/icons/x-circle.svg'
import { Button, DesktopRequired, Field, MaterialLoader, useModal } from '@components'
import { TalismanHandLike } from '@components/TalismanHandLike'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { useAccountSelector } from '@components/widgets/AccountSelector'
import { writeableSubstrateAccountsState } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ContributeEvent, useCrowdloanContribute } from '@libs/crowdloans'
import { Acala, Moonbeam, Polkadex, overrideByIds } from '@libs/crowdloans/crowdloanOverrides'
import { useCrowdloanById } from '@libs/talisman'
import { CircularProgressIndicator, Text } from '@talismn/ui'
import { isMobileBrowser } from '@util/helpers'
import { Maybe } from '@util/monads'
import { useCallback, useEffect, useMemo, useState, type MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

export type ContributeProps = {
  className?: string
  id?: string
}

export default function Contribute({ className, id }: ContributeProps) {
  const { closeModal } = useModal()

  const [contributeState, dispatch] = useCrowdloanContribute()

  const { crowdloan } = useCrowdloanById(id)
  useEffect(() => {
    if (!id || !crowdloan) return

    const relayChainId = crowdloan.relayChainId
    const parachainId = Number(crowdloan.parachain.paraId.split('-').slice(-1)[0])

    dispatch(ContributeEvent.initialize({ crowdloanId: id, relayChainId, parachainId }))
  }, [id, crowdloan, dispatch])

  if (isMobileBrowser()) return <DesktopRequired />

  return (
    <>
      {contributeState.match({
        Uninitialized: () => null,
        Initializing: () => <Loading />,

        NoRpcsForRelayChain: () => 'Sorry, making contributions to this crowdloan via Talisman is not yet supported.',
        NoChaindataForRelayChain: () =>
          'Sorry, making contributions to this crowdloan via Talisman is not yet supported.',
        IpBanned: () => 'Sorry, this crowdloan is not accepting contributions from IP addresses within your region.',

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
        RegisteringUser: props => (
          <RegisteringUser
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
      })}
    </>
  )
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
    accountBalance,
    email,
    memoAddress,

    validationError,
    submissionRequested,
  }: any) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const { t: tError } = useTranslation('errors')

    const [chainHasTerms, termsAgreed, onTermsCheckboxClick] = useTerms(relayChainId, parachainId)

    const [account, accountSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

    useEffect(() => {
      dispatch(ContributeEvent.setAccount(account?.address))
    }, [dispatch, account])

    return (
      <form
        css={{
          '@media(min-width: 44rem)': {
            width: '40rem',
          },
        }}
        className={className}
        onSubmit={event => {
          event.preventDefault()
          dispatch(ContributeEvent.contribute)
        }}
      >
        <header>
          <h2>{t('Contribute to')}</h2>
          <Parachain.Asset className="logo" id={`${relayChainId as string}-${parachainId as string}`} type="logo" />
          <h3>{parachainName}</h3>
        </header>
        <main>
          <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', marginBottom: '2.4rem' }}>
            {accountSelector}
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
              <Text.BodySmall
                className="info-row usd-and-error"
                css={{ height: '1.25em', display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem' }}
              >
                {
                  <span>
                    {Maybe.of(accountBalance).mapOr<any>(<CircularProgressIndicator size="1em" />, x =>
                      Number(x).toFixed(2)
                    )}{' '}
                    available
                  </span>
                }
                {validationError && (
                  <span className="error" css={{ color: theme.color.onError }}>
                    {tError(validationError.i18nCode, validationError.vars)}
                  </span>
                )}
              </Text.BodySmall>
            </div>
          </div>
          {Moonbeam.is(relayChainId, parachainId) && (
            <div className="row">
              <div className="memo-address-input">
                <Field.Input
                  value={memoAddress}
                  onChange={(memoAddress: string) => dispatch(ContributeEvent.setMemoAddress(memoAddress))}
                  dim
                  placeholder="Moonbeam Rewards Address"
                  disabled={submissionRequested}
                />
                <div className="info">
                  Enter the address where your rewards will be paid out. This must be a Moonbeam address or an Ethereum
                  address for which you have the private keys. If you do not have one,{' '}
                  <a href="https://moonbeam.foundation/tutorials/how-to-create-a-moonbeam-ethereum-address-2/">
                    follow this tutorial
                  </a>{' '}
                  to create one. <strong>Using an invalid account will result in a loss of funds.</strong>
                  <br />
                  <br />
                  <strong>Do not use an exchange address</strong>, an Ethereum address that is mapped to a Substrate
                  address, or any other kind of address where you do not have direct control over the private keys. This
                  will prevent you from being able to collect rewards in the future.
                  <br />
                  <br />
                  You can change your registered Moonbeam address by modifying this field and submiting a new
                  contribution.
                </div>
              </div>
            </div>
          )}

          {Acala.is(relayChainId, parachainId) && (
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
                  All contributions via the Talisman dashboard are made to Acala's liquid crowdloan (lcDOT) offer and
                  are subject to the rewards and vesting schedule described
                  <a
                    href="https://medium.com/acalanetwork/acala-liquid-crowdloan-dot-lcdot-launch-on-polkadot-f28d8f561157#4080"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    here
                  </a>
                </div>
              </div>
            </div>
          )}

          {Polkadex.is(relayChainId, parachainId) && (
            <div className="row">
              <div className="email-input">
                <div className="info">
                  <i>
                    If you have 1 PDEX in your Talisman account, you can contribute as much or as little DOT as you want
                    without worrying about the existential deposit. If you do not currently have any PDEX in your
                    Talisman account and wish to contribute less than 22 DOT, please buy at least 1 PDEX, so the account
                    has existential deposit requirement and is in active state to receive the reward.
                  </i>
                </div>
              </div>
            </div>
          )}

          {chainHasTerms && (
            <div className="row">
              <div className="email-input">
                <div className="info">
                  <input id="chain-terms" type="checkbox" onClick={onTermsCheckboxClick} />
                  <label htmlFor="chain-terms">
                    I have read and agree to the{' '}
                    <a
                      href={overrideByIds(relayChainId, parachainId)?.terms?.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {overrideByIds(relayChainId, parachainId)?.terms?.label}
                    </a>
                    .
                  </label>
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
              validationError?.i18nCode === 'A minimum of {{minimum}} {{token}} is required' ||
              (chainHasTerms && !termsAgreed)
            }
          >
            {t('Contribute')}
          </Button>
        </footer>
      </form>
    )
  }
)`
  max-width: 648px;

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
  > main > .row > .memo-address-input,
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

export type ProgressProps = { className?: string; explorerUrl?: string; closeModal: () => unknown; error?: any }

const InProgress = styled(({ className, explorerUrl, closeModal }: ProgressProps) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('inProgress.header')}</h2>
        <TalismanHandLoader />
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
    margin-bottom: 4rem;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
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
      color: var(--color-background);
      background: var(--color-primary);
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

const RegisteringUser = styled(({ className, dispatch, submissionRequested }: any) => {
  const { t } = useTranslation('crowdloan')

  const terms =
    'https://glib-calendula-bf6.notion.site/Moonbeam-Crowdloan-Terms-and-Conditions-da2d8fe389214ae9a382a755110a6f45'

  return (
    <div className={className}>
      <header>
        <h2>{t('registeringUser.header')}</h2>
      </header>
      <main>
        {submissionRequested ? (
          <Loading className="loading" />
        ) : (
          <>
            <div>{t('registeringUser.description')}</div>
            <a href={terms} target="_blank" rel="noopener noreferrer">
              {t('registeringUser.termsNote')}
            </a>
            <div>{t('registeringUser.feeNote')}</div>
          </>
        )}
      </main>
      <footer>
        <Button
          type="submit"
          primary
          disabled={submissionRequested}
          onClick={() => {
            dispatch(ContributeEvent.registerUser)
          }}
        >
          {t('registeringUser.primaryCta')}
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
    margin-bottom: 2rem;

    > * {
      margin-bottom: 2rem;
    }

    > a {
      color: var(--color-primary);
    }

    div:nth-child(3) {
      font-size: 1.5rem;
      color: var(--color-mid);
      font-style: italic;
    }

    > .loading {
      margin-top: 0;
      margin-bottom: 6.2rem;
    }

    > button {
      min-height: 7rem;
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

const Success = styled(({ className, closeModal, explorerUrl }: ProgressProps) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('success.header')}</h2>
        <TalismanHandLike />
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
    margin-bottom: 4rem;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
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
      color: var(--color-background);
      background: var(--color-primary);
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

const Failed = styled(({ className, explorerUrl, error, closeModal }: ProgressProps) => {
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

function useTerms(relayId: number, paraId: number): [boolean, boolean, MouseEventHandler<HTMLInputElement>] {
  const chainHasTerms = useMemo(() => overrideByIds(relayId, paraId)?.terms !== undefined, [paraId, relayId])

  const [termsAgreed, setTermsAgreed] = useState(!chainHasTerms)
  const onTermsCheckboxClick = useCallback((event: any) => setTermsAgreed(event.target.checked), [])

  return [chainHasTerms, termsAgreed, onTermsCheckboxClick]
}
