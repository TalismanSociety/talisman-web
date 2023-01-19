import { selectedAccountAddressesState } from '@domains/accounts/recoils'
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
import { useRecoilState } from 'recoil'

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
  const [addresses, setAddresses] = useState<string[]>([])

  useEffect(() => {
    setAddresses(activeAccount ? [activeAccount.address] : accounts.map(account => account.address))
  }, [activeAccount, accounts])

  return addresses
}

export const useAccounts = () => {
  const { accounts } = useContext()
  return accounts
}

export const useAllAccountAddresses = () => {
  const { accounts, activeAccount } = useContext()
  const [addresses, setAddresses] = useState<string[]>([])

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
  activeAccount: Account | undefined
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
  const [selectedAddresses, setSelectedAddresses] = useRecoilState(selectedAccountAddressesState)

  const switchAccount = useCallback(
    (address: string) => {
      setSelectedAddresses(!address ? undefined : [address])
      trackGoal('KIPBMS1X', 1) // switch_accounts
    },
    [setSelectedAddresses]
  )

  const value = useMemo(
    () => ({
      accounts,
      activeAccount: accounts.find(({ address }) => selectedAddresses?.includes(address)),
      status,
      switchAccount,
      connect,
    }),
    [accounts, status, switchAccount, connect, selectedAddresses]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
