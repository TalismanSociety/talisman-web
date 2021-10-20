import { StyledLoader } from '@components/Await'
import ExtensionStateGate from '@components/ExtensionStatusGate'

import Wallet from './Wallet'
import Welcome from './Welcome'

const Home = () => {
  return (
    <ExtensionStateGate
      loading={<StyledLoader />}
      unavailable={<Welcome />}
      noaccount={<Wallet />}
      unauthorized={<Wallet />}
    >
      <Wallet />
    </ExtensionStateGate>
  )
}

export default Home
