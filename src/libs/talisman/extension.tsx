import { trackGoal } from '@libs/fathom'
import { Signer } from '@polkadot/api/types'
import { InjectedProvider } from '@polkadot/extension-inject/types'
import { isWeb3Injected, web3Enable } from '@talismn/dapp-connect'
import {
  PropsWithChildren,
  useContext as _useContext,
  createContext,
  useCallback,
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

export type Status = 'LOADING' | 'DISCONNECTED' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'NOACCOUNT' | 'OK'

//
// Hooks (exported)
//

export const useExtension = () => useContext()
export const useExtensionAutoConnect = () => {
  const { connect, ...context } = useContext()

  useEffect(() => {
    connect()
  }, [connect])

  return context
}

//
// Context
//

type ContextProps = {
  connect: () => void
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

  const [shouldConnect, setShouldConnect] = useState(false)

  const [status, setStatus] = useState<Status>('LOADING')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [provider, setProvider] = useState<InjectedProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)

  const connect = useCallback(() => {
    setStatus(status => (status === 'DISCONNECTED' ? 'LOADING' : status))
    setShouldConnect(true)
    localStorage.setItem('talisman-wallet-connected', 'true')
  }, [])

  useEffect(() => {
    if (!shouldConnect && !localStorage.getItem('talisman-wallet-connected')) {
      setStatus('DISCONNECTED')
      return
    }

    if (recheckId) {
      // do nothing
    }

    let unsub: Function | null = null
    let cancelled = false

    ;(async () => {
      const injectedExtensions = await web3Enable(process.env.REACT_APP_APPLICATION_NAME || 'Talisman')
      const extension =
        injectedExtensions.find(ext => ext.name === 'talisman') ||
        injectedExtensions.find(ext => ext.name === 'polkadot-js')

      if (!isWeb3Injected) {
        if (!cancelled) setStatus('UNAVAILABLE')
        return
      }

      if (!extension) {
        if (!cancelled) setStatus('UNAUTHORIZED')
        return
      }

      if (cancelled) return
      if (extension.provider) setProvider(extension.provider)
      setSigner(extension.signer)

      trackGoal('4RJ4JXDB', 1) // wallet_connected_polkadotjs

      unsub = extension.accounts.subscribe(accounts => {
        if (cancelled) return
        setAccounts(accounts)
        setStatus(accounts.length < 1 ? 'NOACCOUNT' : 'OK')

        if (!localStorage.getItem('talisman-wallet-connected') && accounts.length < 1) {
          localStorage.setItem('talisman-wallet-connected', 'true')
        }

        trackGoal('XNNVIVMR', accounts.length) // total_accounts_polkadotjs
      })

      if (cancelled) unsub()
    })()

    return () => {
      cancelled = true
      unsub && unsub()
    }
  }, [shouldConnect, recheckId])

  useEffect(() => {
    const recheckStatuses = ['UNAVAILABLE', 'UNAUTHORIZED']
    if (!recheckStatuses.includes(status)) return
    if (localStorage.getItem('talisman-disable-extension-status-polling') === 'true') return

    const intervalId = setInterval(recheck, 1000)
    return () => clearInterval(intervalId)
  }, [status])

  const value = useMemo(
    () => ({ connect, accounts, status, provider, signer }),
    [connect, accounts, status, provider, signer]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
