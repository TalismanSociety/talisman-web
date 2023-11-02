import { useRecoilState, useRecoilValue } from 'recoil'
import { accountsState } from '@domains/extension'
import Landing from '../Landing'
import { selectedAccountState } from '@domains/auth'
import SignInPage from './SignInPage'

type Props = {
  requireSignIn?: boolean
}

/**
 * A wrapper component for pages that require some extension accounts to be connected.
 * Also allows checking if a multisig is required to be connected.
 * */
const RequireAuth: React.FC<React.PropsWithChildren & Props> = ({ children, requireSignIn }) => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const signedInAccount = useRecoilValue(selectedAccountState)

  // show landing page for connection if not accounts connected
  if (extensionAccounts.length === 0) {
    return <Landing disableRedirect />
  }

  if (requireSignIn && !signedInAccount) return <SignInPage accounts={extensionAccounts} />

  return <>{children}</>
}

export default RequireAuth
