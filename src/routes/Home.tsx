import { useActiveAccount } from '@libs/talisman'

import Wallet from './Wallet'
import Welcome from './Welcome'

const Home = () => {
  const { status } = useActiveAccount()
  if (status === 'OK') {
    return <Wallet />
  }
  return <Welcome />
}

export default Home
