import { InjectedAccount } from '@domains/extension'
import Logo from '@components/Logo'
import { Button } from '@talismn/ui'
import { useState } from 'react'
import AccountComboBox from '../../components/AccountComboBox'
import { web3FromSource } from '@polkadot/extension-dapp'
import toast from 'react-hot-toast'

type Props = {
  accounts: InjectedAccount[]
}

const SignInPage: React.FC<Props> = ({ accounts }) => {
  const [accountToSignIn, setAccountToSignIn] = useState(accounts[0] as InjectedAccount)
  const [signingIn, setSigningIn] = useState(false)

  // make sign in a hook that handles updating recoil state and we can just do const signIn = useSignIn(selectedAccount)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSigningIn(true)
    try {
      // to be able to retrieve the signer interface from this account
      // we can use web3FromSource which will return an InjectedExtension type
      const injector = await web3FromSource(accountToSignIn.meta.source)

      if (!injector.signer.signRaw) {
        return toast.error('Wallet does not support signing message.')
      }

      // generate nonce from server
      const res = await fetch('http://localhost:8080/api/rest/siws-nonce', {
        method: 'post',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      // error string captured by Hasura (e.g. invalid hasura query)
      if (data.error) throw new Error(data.error)

      const {
        siwsNonce: { nonce },
      } = data

      // constuct payload with nonce
      // TODO: make a library to construct payload so frontend and backend will always have same structure
      const ss58Address = accountToSignIn.address.toSs58()
      const payload = JSON.stringify({ address: ss58Address, nonce }, undefined, 2)

      // sign payload for backend verification
      const { signature } = await injector.signer.signRaw({
        address: ss58Address,
        data: payload,
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
      console.log(verifyData)
    } catch (e) {
      console.log(e)
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 72, padding: 24, alignItems: 'center' }}>
      <header>
        <Logo css={{ width: 133 }} />
      </header>

      <section
        css={({ backgroundSecondary }) => ({
          backgroundColor: `rgb(${backgroundSecondary})`,
          borderRadius: 24,
          maxWidth: 864,
          padding: '80px 24px',
          width: '100%',
        })}
      >
        <form
          onSubmit={handleSignIn}
          css={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 528,
            margin: '0 auto',
          }}
        >
          <h1 css={{ textAlign: 'center', marginBottom: 36 }}>
            {accounts.length > 1 ? 'Select an account to sign in with' : 'Sign in to access Vault.'}
          </h1>
          <AccountComboBox selectedAccount={accountToSignIn} accounts={accounts} onSelect={setAccountToSignIn} />
          <Button
            type="submit"
            onClick={handleSignIn}
            disabled={signingIn}
            loading={signingIn}
            css={{ height: 56, width: '100%', maxWidth: 240, marginTop: 48 }}
          >
            Sign In
          </Button>
        </form>
      </section>
    </div>
  )
}

export default SignInPage
