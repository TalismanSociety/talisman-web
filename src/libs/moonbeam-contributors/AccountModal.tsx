import { ReactComponent as XCircle } from '@assets/icons/x-circle.svg'
import { Button, Field } from '@components'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import Identicon from '@polkadot/react-identicon'
import { planckToTokens } from '@talismn/util'
import { truncateString } from '@util/helpers'
import { useEffect } from 'react'
import styled from 'styled-components'

import { ContributorWithName, moonbeamRelaychain, useSetMoonbeamRewardsAddress } from '.'

export type AccountModalProps = {
  className?: string
  account: ContributorWithName
  selectAccount: (contributor?: ContributorWithName) => void
  refetch: () => void
}
export const AccountModal = styled(({ className, account, selectAccount, refetch }: AccountModalProps) => {
  const { state, setRewardsAddress, send } = useSetMoonbeamRewardsAddress(
    account.rewardsAddress === null ? account.id : undefined
  )
  const hasRewardsAddress = account.rewardsAddress !== null || state.type === 'SUCCESS'
  const rewardsAddress =
    account.rewardsAddress !== null
      ? account.rewardsAddress
      : state.type === 'SUCCESS'
      ? state.rewardsAddress
      : undefined

  useEffect(() => {
    state.type === 'SUCCESS' && refetch()
  }, [state, refetch])

  return (
    <form
      className={className}
      onSubmit={event => {
        event.preventDefault()
        send()
      }}
    >
      <h3>{hasRewardsAddress ? 'Linked Address' : 'Link Ethereum address'}</h3>
      <div className={`info${hasRewardsAddress ? ' hasRewardsAddress' : ''}`}>
        <div>
          <span>Account</span>
          <span>
            <Identicon className="identicon" value={account.id} theme={'polkadot'} /> {account.name}
          </span>
        </div>
        <div>
          <span>Contribution</span>
          <span>
            {planckToTokens(account.totalContributed, moonbeamRelaychain.tokenDecimals)}{' '}
            {moonbeamRelaychain.tokenSymbol}
          </span>
        </div>
        {hasRewardsAddress ? (
          <div>
            <span>Ethereum address</span>
            <span>{truncateString(rewardsAddress, 4, 4)}</span>
          </div>
        ) : null}
        {state.type === 'SUCCESS' && state.explorerUrl && (
          <p>
            <a className="explorer-url" href={state.explorerUrl} target="_blank" rel="noopener noreferrer">
              View on Subscan
            </a>
          </p>
        )}
      </div>
      {!hasRewardsAddress && (state.type === 'INIT' || state.type === 'SUBMITTING') ? (
        <Field.Input
          value={state.rewardsAddress}
          onChange={setRewardsAddress}
          dim
          placeholder="Moonbeam Rewards Address"
          disabled={state.type !== 'INIT'}
        />
      ) : null}
      {state.type === 'FINALIZING' && (
        <>
          <TalismanHandLoader />
          <p>Linking address</p>
          {state.explorerUrl && (
            <p>
              <a className="explorer-url" href={state.explorerUrl} target="_blank" rel="noopener noreferrer">
                View on Subscan
              </a>
            </p>
          )}
        </>
      )}
      {state.type === 'FAILED' && (
        <>
          <XCircle className="status-icon" />
          <p>Failed to link address</p>
          {state.error !== undefined && <div className="error">{state.error}</div>}
          {state.explorerUrl && (
            <p>
              <a className="explorer-url" href={state.explorerUrl} target="_blank" rel="noopener noreferrer">
                View on Subscan
              </a>
            </p>
          )}
        </>
      )}
      {hasRewardsAddress && <Button onClick={() => selectAccount()}>Back</Button>}
      {!hasRewardsAddress && (state.type === 'INIT' || state.type === 'SUBMITTING') && (
        <Button
          className="fullwidth"
          primary
          type="submit"
          loading={state.type !== 'INIT'}
          disabled={state.type !== 'INIT'}
        >
          Confirm
        </Button>
      )}
      {!hasRewardsAddress && state.type === 'INIT' && state.error !== undefined ? (
        <div className="error">{state.error}</div>
      ) : null}
    </form>
  )
})`
  padding: 0 6.5rem;
  text-align: center;

  > h3 {
    font-size: 2.4rem;
    font-weight: bold;
    color: var(--color-text);
    margin-bottom: 6.4rem;
  }

  > .info {
    margin-bottom: 2rem;

    &.hasRewardsAddress {
      margin-bottom: 6.4rem;
    }

    > div {
      margin: 1.2rem 0;
      display: flex;
      justify-content: space-between;
    }

    > div > span:last-child {
      color: var(--color-text);
      font-weight: bold;
    }

    > div > span > .identicon {
      margin-right: 0.3em;
      font-size: 1em;
      vertical-align: middle;
      cursor: unset;
    }
  }

  > .field {
    margin-bottom: 6.4rem;
  }

  > .status-icon {
    font-size: 6.4rem;
    color: var(--color-status-error);
    user-select: none;
  }

  > .info > p > .explorer-url,
  > p > .explorer-url {
    display: inline-block;
    margin: 2rem auto 0;
    color: var(--color-background);
    background: var(--color-primary);
    border-radius: 5.6rem;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
  }

  > .fullwidth {
    width: 100%;
  }

  > .error {
    margin-top: 2rem;
    color: var(--color-status-error);
  }
`
