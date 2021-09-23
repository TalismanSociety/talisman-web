import { useGuardian } from '@libs/talisman'
import { FC, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const Context = createContext({})

const useActiveAccount = () => {
  const { activeAccount, status, message, switchAccount } = useContext(Context)

  return { ...activeAccount, hasActiveAccount: !!activeAccount, status, message, switchAccount }
}

const useAccountAddresses = () => {
  const { accounts, activeAccount } = useContext(Context)
  const [addresses, setAddresses] = useState<string[] | undefined>()

  useEffect(() => {
    setAddresses(activeAccount ? [activeAccount.address] : accounts.map(account => account.address))
  }, [activeAccount, accounts])

  return addresses
}

const Provider: FC = ({ children }) => {
  const { accounts, status, message } = useGuardian()

  const [activeAccountIndex, setActiveAccountIndex] = useState(-1)

  const switchAccount = useCallback(
    address => {
      const accountIndex = accounts.findIndex(account => account.address === address)
      setActiveAccountIndex(accountIndex)
    },
    [accounts]
  )

  const value = useMemo(
    () => ({
      accounts,
      activeAccount: accounts[activeAccountIndex],
      status,
      message,
      switchAccount,
    }),
    [accounts, activeAccountIndex, status, message, switchAccount]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

const Account = {
  Provider,
  useActiveAccount,
  useAccountAddresses,
}

export default Account
