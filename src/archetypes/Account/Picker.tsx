import { ReactComponent as AllAccountsIcon } from '@assets/icons/all-accounts.svg'
import { ButtonIcon } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as Check } from '@icons/check-circle.svg'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { Account, useAccounts } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { device } from '@util/breakpoints'
import useOnClickOutside from '@util/useOnClickOutside'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Dropdown = styled(({ className, showAllAccounts = false, accounts, activeAccount, open, handleChange }) => {
  const { t } = useTranslation()

  if (!open) return null
  return (
    <span className={`account-picker ${className}`}>
      {showAllAccounts ? (
        <div className="account" onClick={() => handleChange(undefined)}>
          <span className="left">
            <Identicon
              className="identicon"
              Custom={AllAccountsIcon}
              value="5DHuDfmwzykE9KVmL87DLjAbfSX7P4f4wDW5CKx8QZnQA4FK"
              theme="polkadot"
            />
            <span className="name-address">
              <div className="name">{t('All Accounts')}</div>
            </span>
          </span>
          <span className="right">{activeAccount === undefined && <Check className="active" />}</span>
        </div>
      ) : null}

      {accounts.map((account: any) => (
        <div key={account.address} className="account" onClick={() => handleChange(account)}>
          <span className="left">
            <Identicon
              className="identicon"
              value={account.address}
              theme={account.type === 'ethereum' ? 'ethereum' : 'polkadot'}
            />
            <span className="name-address">
              <div className="name">{account.name}</div>
            </span>
          </span>
          <span className="right">{activeAccount?.address === account?.address && <Check className="active" />}</span>
        </div>
      ))}
    </span>
  )
})`
  background: rgb(${({ theme }) => theme?.background});
  font-size: 0.8em;
  font-size: 1em;
  width: 150%;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 1.2rem;
  border: solid 1px var(--color-activeBackground);
  box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  > .account {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    width: 100%;
    cursor: pointer;
    justify-content: space-between;
    transition: all 0.15s;

    span {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .identicon {
      color: var(--color-primary);
      background: var(--color-activeBackground);
      border-radius: 999999999999rem;

      > svg,
      > img {
        font-size: var(--font-size-xlarge);
        width: 1em;
        height: 1em;
      }
      img {
        border-radius: 999999999999rem;
      }
    }

    .name-address {
      display: block;
      min-width: 0;
    }

    .name {
      margin-left: 0.4em;
      font-weight: bold;
      letter-spacing: -0.03em;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .address {
      font-size: 0.85em;
      opacity: 0.5;
      margin-left: 0.6em;
    }

    .balancePrice {
      justify-content: flex-end;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    svg {
      color: var(--color-primary);
    }
  }

  ${({ open }) =>
    !!open &&
    `
      max-height: 25.5rem;
    `}
`

const AccountPicker = styled(({ className, onChange, showAllAccounts = false, additionalAccounts = [] }) => {
  const { t } = useTranslation()
  const nodeRef = useRef<HTMLDivElement>(null)
  const _accounts = useAccounts()
  const [open, setOpen] = useState(false)
  const [activeAccount, setActiveAccount] = useState<Account | undefined>()

  const [accounts, setAccounts] = useState<Account[]>()
  useEffect(() => {
    const accounts = [..._accounts, ...additionalAccounts]
    setAccounts(accounts)
    setActiveAccount(showAllAccounts ? undefined : accounts[0])
  }, [_accounts])

  // pass the active account back to the parent on change
  useEffect(() => {
    onChange(activeAccount)
  }, [activeAccount])

  useOnClickOutside(nodeRef, () => setOpen(false))

  return (
    <div ref={nodeRef} className="account-picker" onClick={() => setOpen(!open)}>
      <span className={`account-button ${className}`}>
        {activeAccount ? (
          <Identicon
            className="identicon"
            value={activeAccount.address}
            theme={activeAccount.type === 'ethereum' ? 'ethereum' : 'polkadot'}
          />
        ) : (
          <Identicon
            className="identicon"
            Custom={AllAccountsIcon}
            value="5DHuDfmwzykE9KVmL87DLjAbfSX7P4f4wDW5CKx8QZnQA4FK"
            theme="polkadot"
          />
        )}

        <span className="selected-account">
          <div>{activeAccount ? activeAccount.name : t('All Accounts')}</div>
        </span>

        <ButtonIcon
          className="nav-toggle"
          onClick={(e: any) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          <ChevronDown />
        </ButtonIcon>

        <Dropdown
          open={open}
          showAllAccounts={showAllAccounts}
          accounts={accounts}
          activeAccount={activeAccount}
          handleChange={(account: Account) => {
            setActiveAccount(account)
            setOpen(false)
          }}
        />
      </span>
    </div>
  )
})`
  font-size: inherit;
  display: flex;
  align-items: center;
  padding: 1rem 0;
  position: relative;

  :hover {
    cursor: pointer;
  }

  > .identicon {
    margin-right: 0.3em;
    color: var(--color-primary);
    background: var(--color-activeBackground);
    border-radius: 999999999999rem;

    > svg,
    > img {
      font-size: var(--font-size-xlarge);
      width: 1em;
      height: 1em;
    }
    img {
      border-radius: 999999999999rem;
    }
  }

  > .nav-toggle {
    margin-left: 0.5em;
    background: inherit;
  }

  > .selected-account {
    display: block;
    margin-left: 0.4em;
    > div {
      line-height: 1.3em;
      min-width: 15rem;
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
      width: 6.7em;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .identicon {
    cursor: inherit;
  }

  .account-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    margin-top: 1rem;

    @media ${device.lg} {
      left: unset;
      right: 0;
    }

    @media ${device.xxl} {
      right: unset;
      left: 0;
    }
  }
`

export default AccountPicker
