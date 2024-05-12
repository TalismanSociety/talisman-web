import { toast } from '@talismn/ui'
import { tryParseSubstrateOrEthereumAddress } from '../../util/addressValidation'
import { isNilOrWhitespace } from '../../util/nil'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { readOnlyAccountsState, type ReadonlyAccount } from './recoils'
import { useResolveNsName } from '../../libs/onChainId'

export const useSetReadonlyAccounts = () => {
  const setReadonlyAccounts = useSetRecoilState(readOnlyAccountsState)

  return {
    add: useCallback(
      (account: ReadonlyAccount) => {
        setReadonlyAccounts(accounts => [
          ...accounts.filter(x => x.address !== account.address),
          { ...account, name: isNilOrWhitespace(account.name) ? undefined : account.name },
        ])
        toast.success('Watched account added successfully')
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

  const [addressFromNs, { isNsFetching }] = useResolveNsName(address)

  const parsedAddress = useMemo(() => tryParseSubstrateOrEthereumAddress(address), [address])
  const resultingAddress = addressFromNs ?? parsedAddress

  const hasExistingAccount = useMemo(
    () =>
      resultingAddress !== undefined &&
      readonlyAccounts.map(x => x.address.toLowerCase()).includes(resultingAddress.toLowerCase()),
    [readonlyAccounts, resultingAddress]
  )

  const confirmState = useMemo(() => {
    if (resultingAddress === undefined || hasExistingAccount) {
      return 'disabled' as const
    }
    return undefined
  }, [hasExistingAccount, resultingAddress])

  const error = useMemo(() => {
    if (isNsFetching) return undefined

    if (address !== '' && resultingAddress === undefined) {
      return 'Invalid address'
    }

    if (hasExistingAccount) {
      return 'This account has already been added'
    }

    return undefined
  }, [address, hasExistingAccount, isNsFetching, resultingAddress])

  return {
    name: [name, setName] as const,
    address: [address, setAddress] as const,
    resultingAddress,
    confirmState,
    loading: isNsFetching,
    error,
    submit: useCallback(() => {
      if (resultingAddress !== undefined) {
        add({ address: resultingAddress, name })
      }
    }, [add, name, resultingAddress]),
  }
}
