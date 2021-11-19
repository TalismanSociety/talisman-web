import { ReactComponent as AllAccountsIcon } from '@assets/icons/all-accounts.svg'
import { Button, Pendor, Pill } from '@components'
import { CopyButton } from '@components/CopyButton'
import { ReactComponent as AlertCircle } from '@icons/alert-circle.svg'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { usePortfolio } from '@libs/portfolio'
import { useActiveAccount, useChainByGenesis, useExtensionAutoConnect } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { addTokensToBalances, groupBalancesByAddress, useBalances, useChain } from '@talismn/api-react-hooks'
import { addBigNumbers, encodeAnyAddress, useFuncMemo } from '@talismn/util'
import { device } from '@util/breakpoints'
import customRpcs from '@util/customRpcs'
import { buyNow } from '@util/fiatOnRamp'
import { formatCommas, formatCurrency, truncateString } from '@util/helpers'
import useOnClickOutside from '@util/useOnClickOutside'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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

const BuyItem = styled(({ nativeToken, className, onClick }) => {
  const { t } = useTranslation()
  return (
    <span className={`${className}`} onClick={buyNow}>
      <div className="container">
        <span className="info">
          <AlertCircle width="48" />
          {t('You have no')}
          {` ${nativeToken}`}
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

const Dropdown = styled(
  ({
    className,
    open,
    handleClose,
    allAccounts,
    nativeToken,
    tokenBalancesByAddress,
    totalBalanceByAddress,
    closeParent,
    showBuy = false,
    parachainId,
  }) => {
    const { t } = useTranslation()
    const { switchAccount } = useActiveAccount()
    const { accounts } = useExtensionAutoConnect()
    const { totalUsd, totalUsdByAddress } = usePortfolio()

    const totalBalanceByAddressFunc = address =>
      tokenBalancesByAddress[address] &&
      tokenBalancesByAddress[address].map(balance => balance?.tokens).reduce(addBigNumbers, undefined)

    return (
      open && (
        <span className={`account-picker ${className}`}>
          {totalBalanceByAddress === '0' && showBuy && <BuyItem nativeToken={nativeToken} onClick={closeParent} />}
          {(allAccounts ? [{ name: t('All Accounts') }, ...accounts] : accounts).map(
            ({ address, name, type, genesisHash }, index) => {
              const totalBalance = totalBalanceByAddressFunc(address)
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
                      {/* <div className="name">{address ? truncateString(name, 10, 0) : name}</div> */}
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
                          console.log(`>>> copied`, text)
                        }}
                        onFailed={text => {
                          console.log(`>>> failed`, text)
                        }}
                      />
                    )}
                  </span>

                  <span className="balancePrice">
                    {address ? (
                      // show usd when no chainId specified
                      parachainId === undefined ? (
                        <Pendor prefix={!totalUsdByAddress[encodeAnyAddress(address, 42)] && '-'}>
                          {totalUsdByAddress[encodeAnyAddress(address, 42)] &&
                            formatCurrency(totalUsdByAddress[encodeAnyAddress(address, 42)])}
                        </Pendor>
                      ) : (
                        <Pendor suffix={` ${nativeToken}`}>{totalBalance && formatCommas(totalBalance)}</Pendor>
                      )
                    ) : (
                      <>
                        <Pendor prefix={!totalUsd && '-'}>{totalUsd && formatCurrency(totalUsd)}</Pendor>
                      </>
                    )}
                  </span>
                </div>
              )
            }
          )}
        </span>
      )
    )
  }
)`
  background: rgb(${({ theme }) => theme?.background});
  font-size: 0.8em;
  width: 26em;
  font-size: 1em;
  max-height: 64rem;
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

    .left {
      flex: 0 1 60%;
    }

    .identicon {
      font-size: 2.6em;
      color: var(--color-primary);
      background: var(--color-activeBackground);
      border-radius: 100px;
      > svg,
      > img {
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
  }

  ${({ open }) =>
    !!open &&
    `
      max-height: 36rem;
    `}
`

const Unavailable = styled(({ className }) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <span className="icon">
        <AlertCircle />
      </span>
      <span>{t('No wallet found')}</span>
    </div>
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
  return (
    <Button className={`account-button ${className}`}>
      {`Polkadot{.js}`}
      <br />
      <span className="subtext">{t('Requires Configuration')}</span>
    </Button>
  )
})`
  text-align: center;
  line-height: 1em;
  display: block;
  padding: 0.6em;
  cursor: default;
  .subtext {
    font-size: 0.7em;
    opacity: 0.7;
    text-transform: uppercase;
    font-weight: var(--font-weight-regular);
  }
`

const Unauthorized = styled(({ className }) => {
  return (
    <Button className={`account-button ${className}`}>
      {`Polkadot{.js}`}
      <br />
      <span className="subtext">Requires Authorization</span>
    </Button>
  )
})`
  text-align: center;
  line-height: 1em;
  display: block;
  padding: 0.3em;
  cursor: default;
  .subtext {
    font-size: 0.7em;
    opacity: 0.7;
    text-transform: uppercase;
    font-weight: var(--font-weight-regular);
  }
`

const Authorized = styled(
  ({
    className,
    narrow,
    allAccounts,
    showValue = false,
    closeParent = null,
    showBuy = false,
    fixedDropdown = false,
    parachainId,
  }) => {
    const { t } = useTranslation()
    const nodeRef = useRef<HTMLDivElement>(null)
    const { switchAccount } = useActiveAccount()
    const { accounts } = useExtensionAutoConnect()
    const { hasActiveAccount, address, name, type } = useActiveAccount()
    const { totalUsd, totalUsdByAddress } = usePortfolio()
    const [open, setOpen] = useState(false)

    const usd = hasActiveAccount ? totalUsdByAddress[encodeAnyAddress(address, 42)] : totalUsd
    useEffect(() => {
      if (allAccounts) return
      if (hasActiveAccount) return
      switchAccount(accounts[0].address)
    }, [accounts, allAccounts, hasActiveAccount, switchAccount])

    const hasParachainId = parachainId !== undefined

    const chainIds = useMemo(
      () => [hasParachainId ? parachainId.toString() : undefined].filter(Boolean),
      [hasParachainId, parachainId]
    )
    const addresses = useMemo(() => accounts.map((account: any) => account.address), [accounts])

    const hasManyAccounts = addresses && addresses.length > 1

    const { nativeToken, tokenDecimals } = useChain(parachainId)
    const { balances } = useBalances(addresses, chainIds, customRpcs)

    const tokenBalances = useFuncMemo(addTokensToBalances, balances, nativeToken ? tokenDecimals : undefined)
    const tokenBalancesByAddress = useFuncMemo(groupBalancesByAddress, tokenBalances)

    const onClickOutside = () => {
      setOpen(false)
    }

    useOnClickOutside(nodeRef, onClickOutside)

    const totalBalanceByAddress =
      tokenBalancesByAddress[address] &&
      tokenBalancesByAddress[address].map(balance => balance?.tokens).reduce(addBigNumbers, undefined)

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
            <Identicon className="identicon" value={address} theme={type === 'ethereum' ? 'ethereum' : 'polkadot'} />
          ) : (
            <Identicon
              className="identicon"
              Custom={AllAccountsIcon}
              value="5DHuDfmwzykE9KVmL87DLjAbfSX7P4f4wDW5CKx8QZnQA4FK"
              theme="polkadot"
            />
          )}
          <span className="selected-account">
            <div>{hasActiveAccount ? name : allAccounts ? t('All Accounts') : 'Loading...'}</div>
            {showValue && (
              <div>
                {
                  // show usd when no chainId specified
                  !hasParachainId ? (
                    <Pendor prefix={!usd && '-'}>{usd && formatCurrency(usd)}</Pendor>
                  ) : (
                    <span className="selected-account-balance">
                      <Pendor suffix={` ${nativeToken}`}>
                        {totalBalanceByAddress === '0' && <AlertCircle />}
                        {totalBalanceByAddress && formatCommas(totalBalanceByAddress)}
                      </Pendor>
                    </span>
                  )
                }
              </div>
            )}
          </span>

          {narrow ? (
            <ChevronDown style={{ margin: '0 1rem 0 0.8rem', visibility: hasManyAccounts ? 'visible' : 'hidden' }} />
          ) : (
            <Button.Icon
              className="nav-toggle"
              onClick={(e: any) => {
                e.stopPropagation()
                setOpen(!open)
              }}
            >
              <ChevronDown />
            </Button.Icon>
          )}

          <Dropdown
            open={open}
            handleClose={() => setOpen(false)}
            allAccounts={allAccounts}
            nativeToken={nativeToken}
            tokenBalancesByAddress={tokenBalancesByAddress}
            totalBalanceByAddress={totalBalanceByAddress}
            closeParent={closeParent}
            showBuy={showBuy}
            parachainId={parachainId}
          />
        </span>
      </div>
    )
  }
)`
  font-size: inherit;
  display: flex;
  align-items: center;
  padding: 1rem;
  position: relative;

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
    > svg,
    > img {
      width: 2.5em;
      height: 2.5em;
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
      &:first-child {
        color: var(--color-text);
        font-weight: var(--font-weight-bold);
        width: 6.7em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:last-child {
        opacity: 0.3;
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
        @media ${device.xxl} {
          right: unset;
          left: 0;
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
