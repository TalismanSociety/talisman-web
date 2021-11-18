import { ReactComponent as CheckCircle } from '@assets/icons/check-circle.svg'
import { ReactComponent as ChevronRight } from '@assets/icons/chevron-right.svg'
import Identicon from '@polkadot/react-identicon'
import { truncateString } from '@util/helpers'
import styled from 'styled-components'

import { ContributorWithName } from '.'

export type AccountsModalProps = {
  className?: string
  contributors: ContributorWithName[]
  selectAccount: (contributor?: ContributorWithName) => void
}
export const AccountsModal = styled(({ className, contributors, selectAccount }: AccountsModalProps) => {
  const accounts = contributors
  const hasUnlinked = accounts.some(account => account.rewardsAddress === null)

  return (
    <div className={className}>
      {hasUnlinked ? (
        <>
          <h3>You have unlinked accounts</h3>
          <p>
            In order to receive GLMR rewards you will need to link an Ethereum address to the account you contributed to
            the Moonbeam crowdloan from.
          </p>
          <p className="standalone-link">
            <a
              href="https://moonbeam.foundation/tutorials/how-to-create-a-moonbeam-ethereum-address"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </>
      ) : (
        <>
          <h3>You're all set!</h3>
          <p>You have successfully linked all your accounts. You’ll receive GLMR tokens to the following address(es)</p>
        </>
      )}
      {accounts.map(account => (
        <AccountRow key={account.id} account={account} selectAccount={selectAccount} />
      ))}
    </div>
  )
})`
  padding: 0 6.5rem;
  text-align: center;

  > h3 {
    font-size: 2.4rem;
    font-weight: bold;
    color: var(--color-text);
    margin-bottom: 4rem;
  }

  > p {
    margin: 1.6rem auto;
    font-size: 1.8rem;
  }

  > p:last-of-type {
    margin-bottom: 4rem;
  }

  > .standalone-link a {
    font-size: 1.4rem;
    color: #5a5a5a;
    text-decoration: underline;
  }
`

type AccountRowProps = {
  className?: string
  account: ContributorWithName
  selectAccount: (contributor?: ContributorWithName) => void
}
const AccountRow = styled(({ className, account, selectAccount }: AccountRowProps) => {
  const hasRewardsAddress = account.rewardsAddress !== null

  return (
    <div className={className} onClick={() => selectAccount(account)}>
      <Identicon className="identicon" value={account.id} theme={'polkadot'} />
      <div className="name">{account.name}</div>
      <div className={`address${hasRewardsAddress ? ' linked' : ''}`}>
        {hasRewardsAddress ? truncateString(account.rewardsAddress, 4, 4) : 'No address linked'}
      </div>
      <CheckCircle className={`check${hasRewardsAddress ? ' linked' : ''}`} />
      <ChevronRight className="arrow" />
    </div>
  )
})`
  margin: 0.8rem 0;
  padding: 1.6rem;
  display: grid;
  grid-template: 1fr 1fr / auto 1fr auto auto;
  grid-template-areas: 'avatar name check arrow' 'avatar address check arrow';
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  background: var(--color-controlBackground);
  cursor: pointer;

  > .identicon {
    grid-area: avatar;
    margin-right: 1.6rem;
    font-size: 3.2rem;
    cursor: unset;
  }

  > .name {
    grid-area: name;
    justify-self: start;
    align-self: end;
    font-size: 1.6rem;
    line-height: 1.8rem;
    color: var(--color-text);
  }
  > .address {
    grid-area: address;
    justify-self: start;
    align-self: start;
    font-size: 1.4rem;
    line-height: 1.8rem;
    &:not(.linked) {
      color: var(--color-primary);
    }
  }
  > .check {
    grid-area: check;
    margin-right: 1.6rem;
    font-size: 2.2rem;
    color: #5a5a5a;
    &.linked {
      color: var(--color-primary);
    }
  }
  > .arrow {
    grid-area: arrow;
    margin-right: 1.6rem;
    font-size: 2.2rem;
  }
`
