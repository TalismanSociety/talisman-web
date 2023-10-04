import { useRecoilState, useRecoilValue } from 'recoil'
import { accountsState } from '@domains/extension'
import Landing from '../Landing'
import { activeMultisigsState } from '../../domains/multisig'
import { Navigate } from 'react-router-dom'

type Props = {
  requireMultisig?: boolean
}

/**
 * A wrapper component for pages that require some extension accounts to be connected.
 * Also allows checking if a multisig is required to be connected.
 * */
const RequireExtension: React.FC<React.PropsWithChildren & Props> = ({ children, requireMultisig }) => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)

  // show landing page for connection if not accounts connected
  if (extensionAccounts.length === 0) {
    return <Landing disableRedirect />
  }

  if (requireMultisig && activeMultisigs.length === 0) {
    return <Navigate to="/create" />
  }

  return <>{children}</>
}

export default RequireExtension
