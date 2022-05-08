import { trackGoal } from '@libs/fathom'
import { useExtension } from '@libs/talisman'
import {
  PropsWithChildren,
  useContext as _useContext,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { Account, Status } from './extension'

//
// Hooks (exported)
//

export const useActiveAccount = () => {
  const { activeAccount, status, switchAccount, connect } = useContext()

  useEffect(() => {
    connect()
  }, [connect])

  return { ...activeAccount, hasActiveAccount: !!activeAccount, status, switchAccount }
}

export const useAccountAddresses = () => {
  const { accounts, activeAccount } = useContext()
  const [addresses, setAddresses] = useState<string[] | undefined>()

  useEffect(() => {
    setAddresses(activeAccount ? [activeAccount.address] : accounts.map(account => account.address))
  }, [activeAccount, accounts])

  return addresses
}

export const useAllAccountAddresses = () => {
  const { accounts, activeAccount } = useContext()
  const [addresses, setAddresses] = useState<string[] | undefined>()

  useEffect(() => {
    setAddresses(accounts.map(account => account.address))
  }, [activeAccount, accounts])

  return addresses
}

//
// Context
//

type ContextProps = {
  accounts: Account[]
  activeAccount: Account
  status: Status
  switchAccount: (address: string) => void
  connect: () => void
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The talisman account provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider = ({ children }: PropsWithChildren<{}>) => {
  const { accounts, status, connect } = useExtension()

  const [activeAccountIndex, setActiveAccountIndex] = useState(-1)

  const switchAccount = useCallback(
    address => {
      const accountIndex = accounts.findIndex(account => account.address === address)
      setActiveAccountIndex(accountIndex)
      trackGoal('KIPBMS1X', 1) // switch_accounts
    },
    [accounts]
  )

  const value = useMemo(
    () => ({
      accounts,
      activeAccount: accounts[activeAccountIndex],
      status,
      switchAccount,
      connect,
    }),
    [accounts, activeAccountIndex, status, switchAccount, connect]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
