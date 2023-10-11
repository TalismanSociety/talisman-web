import { InjectedAccount } from '@domains/extension'
import Logo from '@components/Logo'
import { Button } from '@talismn/ui'
import { useState } from 'react'
import { useSignIn } from '@domains/auth'
import AccountComboBox from './AccountComboBox'

type Props = {
  accounts: InjectedAccount[]
}

const SignInPage: React.FC<Props> = ({ accounts }) => {
  const [accountToSignIn, setAccountToSignIn] = useState(accounts[0] as InjectedAccount)
  const { signIn, signingIn } = useSignIn()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    signIn(accountToSignIn)
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
