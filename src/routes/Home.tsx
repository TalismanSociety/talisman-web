import { StyledLoader } from '@components/Await'
import ExtensionStateGate from '@components/ExtensionStatusGate'

import Welcome from './Welcome'

const Home = () => {
  return (
    <ExtensionStateGate
      loading={<StyledLoader />}
      unavailable={<Welcome />}
      noaccount={<Welcome />}
      unauthorized={<Welcome />}
    >
      <Welcome />
    </ExtensionStateGate>
  )
}

export default Home
