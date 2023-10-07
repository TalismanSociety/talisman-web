import { useCallback, useState } from 'react'
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil'
import { web3FromSource } from '@polkadot/extension-dapp'
import { InjectedAccount, accountsState } from '../extension'
import persistAtom from '../persist'
import toast from 'react-hot-toast'

// keyed by ss58 address, value is the auth token
type AuthTokenBook = Record<string, string | undefined>

type SignedInAccount = {
  jwtToken: string
  injected: InjectedAccount
}

// store selected address in local storage
// then derive the JWT and injected account
export const selectedAddressState = atom<string | null>({
  key: 'SelectedAddress',
  default: null,
  effects_UNSTABLE: [persistAtom],
})

export const authTokenBookState = atom<AuthTokenBook>({
  key: 'AuthTokenBook',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

// an account can only be selected if:
// - user has explicitly selected the address
// - jwt is stored in auth book
// - account is connected from extension
export const selectedAccountState = selector<SignedInAccount | null>({
  key: 'SelectedAccount',
  get: ({ get }) => {
    const selectedAddress = get(selectedAddressState)
    const authTokenBook = get(authTokenBookState)
    const extensionAccounts = get(accountsState)

    // account not explicitly selected
    if (!selectedAddress) return null

    // account not signed in, hence cannot be selected
    const jwtToken = authTokenBook[selectedAddress]
    if (jwtToken === undefined) return null

    // account not connected from extension
    const injected = extensionAccounts.find(account => account.address.toSs58() === selectedAddress)
    if (!injected) return null

    return { jwtToken, injected }
  },
})

export const signedInAccountState = atom<string | null>({
  key: 'SignedInAccount',
  default: null,
})

export const useSignIn = () => {
  const [authTokenBook, setAuthTokenBook] = useRecoilState(authTokenBookState)
  const setSelectedAccount = useSetRecoilState(selectedAddressState)
  const [signingIn, setSigningIn] = useState(false)

  const signIn = useCallback(
    async (account: InjectedAccount) => {
      if (signingIn) return
      setSigningIn(true)

      const ss58Address = account.address.toSs58()
      let token = authTokenBook[ss58Address]
      try {
        if (!token) {
          // to be able to retrieve the signer interface from this account
          // we can use web3FromSource which will return an InjectedExtension type
          const injector = await web3FromSource(account.meta.source)

          if (!injector.signer.signRaw) return toast.error('Wallet does not support signing message.')

          // generate nonce from server
          const res = await fetch('http://localhost:8080/api/rest/siws-nonce', {
            method: 'post',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
          const nonceData = await res.json()

          // error string captured by Hasura (e.g. invalid hasura query)
          if (nonceData.error) return toast.error(nonceData.error)

          const nonce = nonceData?.siwsNonce?.nonce

          // should've been captured by `nonceData.error`, but adding this check just to be sure
          if (!nonce) return toast.error('Failed to request for nonce.')

          // constuct payload with nonce
          // TODO: make a library to construct payload so frontend and backend will always have same structure + properties like expiry
          const data = JSON.stringify({ address: ss58Address, nonce }, undefined, 2)

          // sign payload for backend verification
          const { signature } = await injector.signer.signRaw({
            address: ss58Address,
            data,
            type: 'payload',
          })

          // exchange JWT token from server
          const verifyRes = await fetch('http://localhost:8080/api/rest/siws-verify', {
            method: 'post',
            body: JSON.stringify({ address: ss58Address, signedMessage: signature }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          })

          const verifyData = await verifyRes.json()

          token = verifyData?.siwsVerify?.accessToken
        }
        setSelectedAccount(ss58Address)
        setAuthTokenBook({ ...authTokenBook, [ss58Address]: token })
      } catch (e) {
        console.error(e)
        toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to sign in.')
      } finally {
        setSigningIn(false)
      }
    },
    [authTokenBook, setAuthTokenBook, setSelectedAccount, signingIn]
  )

  return { signIn, signingIn }
}

export { AccountWatcher } from './AccountWatcher'
