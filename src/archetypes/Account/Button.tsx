import { ReactComponent as AllAccountsIcon } from '@assets/icons/all-accounts.svg'
import { Button, ButtonIcon, Pendor, Pill } from '@components'
import { Copy } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { CopyButton } from '@components/CopyButton'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactComponent as AlertCircle } from '@icons/alert-circle.svg'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { DAPP_NAME, useActiveAccount, useBalances, useChainByGenesis, useExtensionAutoConnect } from '@libs/talisman'
import { useTalismanInstalled } from '@libs/talisman/useIsTalismanInstalled'
import { WalletSelect } from '@talismn/connect-components'
import { getWalletBySource } from '@talismn/connect-wallets'
import { encodeAnyAddress } from '@talismn/util'
import { device } from '@util/breakpoints'
import { buyNow } from '@util/fiatOnRamp'
import { truncateString } from '@util/helpers'
import useOnClickOutside from '@util/useOnClickOutside'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// format an address based on chain ID, derived from genesis ID
// as returned from polkadot.js extension API
const Address = ({ address, genesis, truncate = false }) => {
  const { id } = useChainByGenesis(genesis)
  let encoded: string
  try {
    encoded = encodeAnyAddress(address, id)
  } catch (error) {
    console.warn('Failed to encode address', address, error)
    encoded = address
  }

  return !!truncate ? truncateString(encoded, truncate[0] || 4, truncate[1] || 4) : encoded
}

const BuyItem = styled(({ nativeToken, className }) => {
  const { t } = useTranslation()
  return (
    <span className={`${className}`} onClick={buyNow}>
      <div className="container">
        <span className="info">
          <AlertCircle width="48" />
          {t('You have no')} {nativeToken}
        </span>
        <Pill small primary>
          {t('Buy')}
        </Pill>
      </div>
    </span>
  )
})`
  color: var(--color-primary);

  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;
  justify-content: space-between;

  .container {
    background: var(--color-controlBackground);
    width: 100%;
    display: flex;
    align-items: center;
    padding: 1.2rem;
    justify-content: space-between;
    border-radius: 1rem;
    > .info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`

const Dropdown = styled(({ className, open, handleClose, allAccounts, closeParent, showBuy = false }) => {
  const { t } = useTranslation()

  const { switchAccount } = useActiveAccount()
  const { accounts, disconnect } = useExtensionAutoConnect()

  const { assetsValue, balances } = useBalances()

  return (
    open && (
      <span className={`account-picker ${className}`}>
        {showBuy && <BuyItem onClick={closeParent} />}
        {(allAccounts ? [{ name: t('All Accounts') }, ...accounts] : accounts).map(
          ({ address, name, type, genesisHash }, index) => {
            // Do the filtering
            const fiatBalance =
              address !== undefined
                ? (balances?.find({ address: address }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'narrowSymbol',
                  }) ?? '-'
                : assetsValue

            return (
              <div
                key={index}
                className="account"
                onClick={() => {
                  switchAccount(address)
                  handleClose()
                }}
              >
                <span className="left">
                  {address ? (
                    <Identicon
                      className="identicon"
                      value={address}
                      theme={type === 'ethereum' ? 'ethereum' : 'polkadot'}
                    />
                  ) : (
                    <Identicon
                      Custom={AllAccountsIcon}
                      className="identicon"
                      value="5DHuDfmwzykE9KVmL87DLjAbfSX7P4f4wDW5CKx8QZnQA4FK"
                      theme="polkadot"
                    />
                  )}
                  <span className="name-address">
                    <div className="name">{name}</div>
                    {address && (
                      <div className="address">
                        <Address address={address} genesis={genesisHash} truncate />
                      </div>
                    )}
                  </span>
                  {address && (
                    <CopyButton
                      text={address}
                      onCopied={text => {
                        toast(
                          <>
                            <Text.Body as="div" alpha="high">
                              Address copied to clipboard
                            </Text.Body>
                            <Text.Body as="div">{text}</Text.Body>
                          </>,
                          { position: 'bottom-right', icon: <Copy /> }
                        )
                      }}
                      onFailed={text => {
                        console.log(`>>> failed`, text)
                      }}
                    />
                  )}
                </span>

                <span className="balance-price">
                  <Pendor require={(balances?.sorted.length || 0) > 0}>{fiatBalance}</Pendor>
                </span>
              </div>
            )
          }
        )}
        <Button
          className="dropdown-button"
          onClick={() => {
            localStorage.removeItem('@talisman-connect/selected-wallet-name')
            document.dispatchEvent(new CustomEvent('@talisman-connect/wallet-selected'))
            disconnect()
            switchAccount('')
          }}
        >
          {t('Disconnect Wallet')}
        </Button>
      </span>
    )
  )
})`
  background: var(--color-controlBackground);
  font-size: 0.8em;
  width: 26em;
  font-size: 1em;
  max-height: 64rem;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 1.2rem;
  border: solid 1px var(--color-activeBackground);
  box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.1);

  .dropdown-button {
    margin: 1.5em 0 1em 0;
    width: 100%;
    height: 100%;
    padding: 0.25em;
    background: none;

    > * {
      background: none;
      border: 1px solid var(--color-dim);
      width: 100%;
      padding: 1em;
      border-radius: 1.2rem;
      font-size: 1.25em;
    }
  }

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

    .left {
      // flex: 0 1 60%;
    }

    .identicon {
      font-size: 2.6em;
      color: var(--color-primary);
      background: var(--color-activeBackground);
      border-radius: 100px;
      width: 1em;
      height: 1em;
      img {
        border-radius: 999999999999rem;
      }
    }

    .name-address {
      display: block;
      min-width: 0;
      max-width: 15rem;
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

    .balance-price {
      justify-content: flex-end;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  ${({ open }) =>
    !!open &&
    `
      max-height: 42rem;
    `}
`

const Unavailable = styled(({ className }) => {
  const { t } = useTranslation()
  const isTalismanInstalled = useTalismanInstalled()
  const title = isTalismanInstalled ? 'Connect wallet' : 'No wallet found'
  return (
    <WalletSelect
      dappName={DAPP_NAME}
      triggerComponent={
        <div className={className} style={{ cursor: 'pointer' }}>
          <span className="icon">
            <AlertCircle />
          </span>
          {title && <span>{t(title)}</span>}
        </div>
      }
    />
  )
})`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-radius: 1.5rem;
  padding: 1rem 2.5rem 1rem 1.5rem;
  background: var(--color-controlBackground);

  .icon {
    padding: 0.75rem;
    border-radius: 12rem;
    background: var(--color-activeBackground);
    display: flex;
  }
`

const NoAccount = styled(({ className }) => {
  const { t } = useTranslation()
  const [walletName, setWalletName] = useState<string | undefined>()
  useEffect(() => {
    const selectedWalletName = localStorage.getItem('@talisman-connect/selected-wallet-name')
    const wallet = getWalletBySource(selectedWalletName)
    setWalletName(wallet?.title)
  }, [])
  return (
    <WalletSelect
      dappName={DAPP_NAME}
      triggerComponent={
        <Button className={`account-button ${className}`}>
          {walletName}
          <br />
          <span className="subtext">{t('Requires Configuration')}</span>
        </Button>
      }
    />
  )
})`
  text-align: center;
  line-height: 1em;
  display: block;
  padding: 0.6em;
  cursor: pointer;
  .subtext {
    font-size: 0.7em;
    opacity: 0.7;
    text-transform: uppercase;
    font-weight: var(--font-weight-regular);
  }
`

const Unauthorized = styled(({ className }) => {
  const [walletName, setWalletName] = useState<string | undefined>()
  useEffect(() => {
    const selectedWalletName = localStorage.getItem('@talisman-connect/selected-wallet-name')
    const wallet = getWalletBySource(selectedWalletName)
    setWalletName(wallet?.title)
  }, [])
  return (
    <WalletSelect
      dappName={DAPP_NAME}
      triggerComponent={
        <Button className={`account-button ${className}`}>
          {walletName}
          <br />
          <span className="subtext">Requires Authorization</span>
        </Button>
      }
      onWalletSelected={wallet => {}}
    />
  )
})`
  text-align: center;
  line-height: 1em;
  display: block;
  padding: 0.3em;
  cursor: pointer;
  .subtext {
    font-size: 0.7em;
    opacity: 0.7;
    text-transform: uppercase;
    font-weight: var(--font-weight-regular);
  }
`

const Authorized = styled(
  ({ className, narrow, allAccounts, closeParent = null, showBuy = false, fixedDropdown = false }) => {
    const { t } = useTranslation()

    const [open, setOpen] = useState(false)

    const { switchAccount } = useActiveAccount()
    const { accounts } = useExtensionAutoConnect()
    const { hasActiveAccount, address, name } = useActiveAccount()

    useEffect(() => {
      if (allAccounts) return
      if (hasActiveAccount) return
      switchAccount(accounts[0].address)
    }, [accounts, allAccounts, hasActiveAccount, switchAccount])

    const addresses = useMemo(() => accounts.map(account => account.address), [accounts])
    const hasManyAccounts = addresses && addresses.length > 1

    const onClickOutside = useCallback(() => setOpen(false), [])
    const nodeRef = useRef<HTMLDivElement>(null)
    useOnClickOutside(nodeRef, onClickOutside)

    return (
      <div
        ref={nodeRef}
        className="account-switcher-pill"
        style={{
          display: 'inline-flex',
          background: 'var(--color-controlBackground)',
          borderRadius: '1rem',
        }}
        onClick={() => setOpen(!open)}
      >
        <span className={`account-button${hasManyAccounts ? ' has-many-accounts' : ''} ${className}`}>
          {hasActiveAccount ? (
            <Identicon className="identicon" value={address} />
          ) : (
            <Identicon
              className="identicon"
              Custom={AllAccountsIcon}
              value="5DHuDfmwzykE9KVmL87DLjAbfSX7P4f4wDW5CKx8QZnQA4FK"
            />
          )}
          <span className="selected-account">
            <div>{hasActiveAccount ? name : allAccounts ? t('All Accounts') : 'Loading...'}</div>
          </span>

          {narrow ? (
            <ChevronDown style={{ margin: '0 1rem 0 0.8rem', visibility: hasManyAccounts ? 'visible' : 'hidden' }} />
          ) : (
            <ButtonIcon
              className="nav-toggle"
              onClick={(e: any) => {
                e.stopPropagation()
                setOpen(!open)
              }}
            >
              <ChevronDown />
            </ButtonIcon>
          )}

          <Dropdown
            open={open}
            handleClose={() => setOpen(false)}
            allAccounts={allAccounts}
            closeParent={closeParent}
            showBuy={showBuy}
          />
        </span>
      </div>
    )
  }
)`
  font-size: inherit;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 1rem;
  position: relative;
  background: var(--color-controlBackground);
  border-radius: 1rem;
  border: 1px solid var(--color-dim);

  :hover {
    cursor: pointer;
  }

  .selected-account-balance {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  > .identicon {
    margin-right: 0.3em;
    color: var(--color-primary);
    background: var(--color-activeBackground);
    border-radius: 100px;
    width: 1.5em;
    height: 1.5em;
    img {
      border-radius: 999999999999rem;
    }
  }

  > .nav-toggle {
    margin-left: 0.5em;
    background: inherit;
    padding: 0;
  }

  > .selected-account {
    display: block;
    margin-left: 0.4em;
    > div {
      line-height: 1.3em;
      &:first-child {
        color: var(--color-foreground);
        width: 6.7em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:last-child {
        font-size: 0.9em;
      }
    }
  }

  .identicon {
    cursor: inherit;
  }

  .account-picker {
    ${({ fixedDropdown }) =>
      fixedDropdown
        ? `position: fixed; top: auto; left: auto;`
        : `
        position: absolute;
        top: 100%;
        left: 0;
        @media ${device.lg} {
          left: unset;
          right: 0;
        }
    `}

    z-index: 10;
    margin-top: 1rem;
  }

  &.has-many-accounts {
    ${props =>
      props.narrow &&
      css`
        cursor: pointer;
      `}
  }
`

const AccountButton = props => {
  const { status } = useActiveAccount()
  switch (status) {
    case 'OK':
      return <Authorized {...props} />
    case 'UNAUTHORIZED':
      return <Unauthorized {...props} />
    case 'UNAVAILABLE':
      return <Unavailable {...props} />
    case 'NOACCOUNT':
      return <NoAccount {...props} />
    default:
      return null
  }
}

export default AccountButton
