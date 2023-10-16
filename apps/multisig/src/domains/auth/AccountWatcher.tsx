import { useRecoilState, useRecoilValue } from 'recoil'
import { authTokenBookState, selectedAddressState } from '.'
import { accountsState, extensionAllowedState, extensionInitiatedState } from '../extension'
import { useCallback, useEffect } from 'react'

export const AccountWatcher: React.FC = () => {
  const [authTokenBook, setAuthTokenBook] = useRecoilState(authTokenBookState)
  const [selectedAccount, setSelectedAccount] = useRecoilState(selectedAddressState)
  const extensionInitiated = useRecoilValue(extensionInitiatedState)

  const extensionAllowed = useRecoilValue(extensionAllowedState)
  const extensionAccounts = useRecoilValue(accountsState)

  const findNextSignedInAccount = useCallback(
    (exclude?: string) =>
      extensionAccounts.find(
        account => account.address.toSs58() !== exclude && !!authTokenBook[account.address.toSs58()]
      ),
    [authTokenBook, extensionAccounts]
  )

  useEffect(() => {
    // user disabled all accounts, clean up all jwt token
    if (!extensionAllowed) {
      setSelectedAccount(null)
      // prevents unnecessary re-render
      if (Object.keys(authTokenBook).length > 0) setAuthTokenBook({})
      return
    }

    // clean up JWT token if user removed account from extension
    // since extensionAllowed is true, if extensionAccounts list is empty,
    // we're in the process of connecting wallet and should not do any clean up yet
    if (extensionInitiated && extensionAccounts.length > 0) {
      Object.keys(authTokenBook).forEach(address => {
        const account = extensionAccounts.find(account => account.address.toSs58() === address)
        if (!account && authTokenBook[address]) {
          setAuthTokenBook({ ...authTokenBook, [address]: undefined })
          if (selectedAccount === address) setSelectedAccount(null)
        }
      })
    }

    // auto select first signed in account if none
    if (!selectedAccount) {
      // auto select first signed in account if none
      const signedInAccount = findNextSignedInAccount()
      if (!signedInAccount) return
      setSelectedAccount(signedInAccount.address.toSs58())
    }
  }, [
    authTokenBook,
    extensionAccounts,
    extensionAllowed,
    extensionInitiated,
    findNextSignedInAccount,
    selectedAccount,
    setAuthTokenBook,
    setSelectedAccount,
  ])

  return null
}
