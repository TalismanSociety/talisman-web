import Identicon from '@components/atoms/Identicon'
// import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { ReactComponent as Check } from '@icons/check-circle.svg'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { useAccounts } from '@libs/talisman'
import { Account } from '@libs/talisman/extension'
import { device } from '@util/breakpoints'
import useOnClickOutside from '@util/useOnClickOutside'
import { useEffect, useRef, useState } from 'react'

type DropdownProps = {
  className?: string
  accounts: Account[]
  activeAccount: Account | undefined
  open: any
  handleChange: any
}

const Dropdown = styled(({ className, accounts, activeAccount, open, handleChange }: DropdownProps) => {
  // const { t } = useTranslation()

  return (
    open && (
      <span className={`account-picker ${className}`}>
        {accounts.map((account: any) => {
          return (
            <div key={account.address} className="account" onClick={() => handleChange(account)}>
              <span className="left">
                <Identicon className="identicon" value={account.address} />
                <span className="name-address">
                  <div className="name">{account.name}</div>
                </span>
              </span>
              <span className="right">
                {activeAccount?.address === account?.address && <Check className="active" />}
              </span>
            </div>
          )
        })}
      </span>
    )
  )
})`
  background: var(--color-background);

  font-size: 0.8em;
  font-size: 1em;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 1.2rem;
  border: solid 1px var(--color-activeBackground);
  box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.1);
  max-width: 30rem;
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
      //font-size: 2.6em;
      color: var(--color-primary);
      background: var(--color-activeBackground);
      border-radius: 100px;
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
      width: 10em;
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
      background: var(--color-controlBackground);
    }
    svg {
      color: var(--color-primary);
      align-slef: felx-end;
    }
  }
  ${({ open }) =>
    !!open &&
    `
      max-height: 25.5rem;
    `}
`

const AccountPicker = styled(
  ({
    additionalAccounts = [],
    className,
    onChange,
  }: {
    additionalAccounts: any[]
    className?: string
    onChange?: any
  }) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    const accounts = useAccounts()
    const [open, setOpen] = useState(false)
    const [activeAccount, setActiveAccount] = useState(accounts[0])

    const [allAccounts, setAllAccounts] = useState([...additionalAccounts, ...accounts])

    useOnClickOutside(nodeRef, () => setOpen(false))

    // we may need a callback here to make sure it's not set already
    useEffect(() => {
      const _allAccounts = [...additionalAccounts, ...accounts]
      setAllAccounts(_allAccounts)
      setActiveAccount(_allAccounts[0])
    }, [accounts, additionalAccounts])

    // pass the active account back to the parent on change
    useEffect(() => {
      if (!activeAccount) return
      onChange(activeAccount)
    }, [activeAccount, onChange])

    return (
      <div ref={nodeRef} className="account-picker" onClick={accounts.length > 1 ? () => setOpen(!open) : undefined}>
        <span className={`account-button ${className}`}>
          <span className={accounts.length > 1 ? 'account' : 'single-account'}>
            <span>
              <Identicon className="identicon" value={activeAccount?.address ?? ''} />

              <span className="selected-account">
                <div>{activeAccount?.name}</div>
              </span>
            </span>

            {accounts.length > 1 && (
              <ChevronDown
                className="nav-toggle"
                onClick={(e: any) => {
                  e.stopPropagation()
                  setOpen(!open)
                }}
              />
            )}
          </span>

          <Dropdown
            open={open}
            accounts={allAccounts}
            activeAccount={activeAccount}
            handleChange={(account: any) => {
              setActiveAccount(account)
              setOpen(false)
            }}
          />
        </span>
      </div>
    )
  }
)`
  font-size: inherit;
  display: flex;
  align-items: center;
  position: relative;
  max-width: 30rem;
  border-radius: 1.2rem 1.2rem;
  background: var(--color-controlBackground);

  .account-button {
  }

  .account-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    margin-top: 1rem;
    @media ${device.xxl} {
      right: unset;
      left: 0;
    }
  }

  .single-account {
    &:hover {
      background: rgba(0, 0, 0, 0) !important;
    }
  }

  > .account,
  .single-account {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    width: 100%;
    cursor: pointer;
    justify-content: space-between;
    transition: all 0.15s;
    border: 1px solid var(--color-activeBackground);
    border-radius: 1.2rem;
    span {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
      > .selected-account {
        margin-left: 0.4em;
        font-weight: bold;
        letter-spacing: -0.03em;
        white-space: nowrap;
        > div {
          width: 10em;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .identicon {
      color: var(--color-primary);
      background: var(--color-activeBackground);
      border-radius: 100px;
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
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`

export default AccountPicker
