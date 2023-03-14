import { isValidSubstrateOrEthereumAddress } from '@util/addressValidation'
import { isNilOrWhitespace } from '@util/nil'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { ReadonlyAccount, readOnlyAccountsState } from './recoils'

export const useSetReadonlyAccounts = () => {
  const setReadonlyAccounts = useSetRecoilState(readOnlyAccountsState)

  return {
    add: useCallback(
      (account: ReadonlyAccount) => {
        setReadonlyAccounts(accounts => [
          ...accounts.filter(x => x.address !== account.address),
          { ...account, name: isNilOrWhitespace(account.name) ? undefined : account.name },
        ])
      },
      [setReadonlyAccounts]
    ),
    remove: useCallback(
      (account: ReadonlyAccount) => {
        setReadonlyAccounts(accounts => accounts.filter(x => x.address !== account.address))
      },
      [setReadonlyAccounts]
    ),
  }
}

export const useAddReadonlyAccountForm = () => {
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)
  const { add } = useSetReadonlyAccounts()
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')

  const isValidAddress = useMemo(
    () => (isNilOrWhitespace(address) ? undefined : isValidSubstrateOrEthereumAddress(address)),
    [address]
  )

  const resultingAddress = isValidAddress ? address : undefined

  const hasExistingAccount = useMemo(
    () => readonlyAccounts.map(x => x.address.toLowerCase()).includes(address.toLowerCase()),
    [address, readonlyAccounts]
  )

  const confirmState = useMemo(() => {
    if (!isValidAddress || hasExistingAccount) {
      return 'disabled' as const
    }
  }, [hasExistingAccount, isValidAddress])

  const error = useMemo(() => {
    if (isValidAddress === false) {
      return 'Invalid address' as const
    }

    if (hasExistingAccount) {
      return 'This account has already been added' as const
    }
  }, [hasExistingAccount, isValidAddress])

  return {
    name: [name, setName] as const,
    address: [address, setAddress] as const,
    resultingAddress,
    confirmState,
    error,
    submit: useCallback(() => add({ address, name }), [add, address, name]),
  }
}
