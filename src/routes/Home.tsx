import { ExtensionStatusGate } from '@components'
import { StyledLoader } from '@components/Await'
import { Redirect } from 'react-router-dom'

import Welcome from './Welcome'

const Home = () => {
  return (
    <ExtensionStatusGate
      loading={<StyledLoader />}
      disconnected={<Welcome />}
      unavailable={<Redirect to="/portfolio" />}
      noaccount={<Redirect to="/portfolio" />}
      unauthorized={<Redirect to="/portfolio" />}
    >
      <Redirect to="/portfolio" />
    </ExtensionStatusGate>
  )
}

export default Home
