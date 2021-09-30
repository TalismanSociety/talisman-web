import { Signer } from '@polkadot/api/types'
import { isWeb3Injected, web3Enable } from '@polkadot/extension-dapp'
import { InjectedProvider } from '@polkadot/extension-inject/types'
import {
  PropsWithChildren,
  useContext as _useContext,
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

//
// Types
//

export type Account = {
  // name contains the user-defined name of the account
  name?: string
  type?: string
  address: string
}

export type Status = 'LOADING' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'NOACCOUNT' | 'OK'

//
// Hooks (exported)
//

export const useExtension = () => useContext()

//
// Context
//

type ContextProps = {
  accounts: Account[]
  status: Status
  provider: InjectedProvider | null
  signer: Signer | null
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The talisman extension provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider = ({ children }: PropsWithChildren<{}>) => {
  const [recheckId, recheck] = useReducer(x => (x + 1) % 16384, 0)

  const [status, setStatus] = useState<Status>('LOADING')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [provider, setProvider] = useState<InjectedProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)

  useEffect(() => {
    if (recheckId) {
      // do nothing
    }

    let unsub: Function | null = null
    let cancelled = false

    ;(async () => {
      const injectedExtensions = await web3Enable(process.env.REACT_APP_APPLICATION_NAME || 'Talisman')
      const polkadotJs = injectedExtensions.find(extension => extension.name === 'polkadot-js')

      if (!isWeb3Injected) {
        if (!cancelled) setStatus('UNAVAILABLE')
        return
      }

      if (!polkadotJs) {
        if (!cancelled) setStatus('UNAUTHORIZED')
        return
      }

      if (cancelled) return
      if (polkadotJs.provider) setProvider(polkadotJs.provider)
      setSigner(polkadotJs.signer)

      unsub = polkadotJs.accounts.subscribe(accounts => {
        if (cancelled) return
        setAccounts(accounts)
        setStatus(accounts.length < 1 ? 'NOACCOUNT' : 'OK')
      })

      if (cancelled) unsub()
    })()

    return () => {
      cancelled = true
      unsub && unsub()
    }
  }, [recheckId])

  useEffect(() => {
    const recheckStatuses = ['UNAVAILABLE', 'UNAUTHORIZED']
    if (!recheckStatuses.includes(status)) return

    const intervalId = setInterval(recheck, 1000)
    return () => clearInterval(intervalId)
  }, [status])

  const value = useMemo(() => ({ accounts, status, provider, signer }), [accounts, status, provider, signer])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
