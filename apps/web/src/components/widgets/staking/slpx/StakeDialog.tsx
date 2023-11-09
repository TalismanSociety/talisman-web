import { glmrSlpxPair } from '@domains/staking/slpx/config'
import AddStakeDialog from './AddStakeDialog'
import { useSearchParams } from 'react-router-dom'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'

const StakeDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  if (searchParams.get('action') === 'stake' && searchParams.get('type') === 'slpx') {
    return (
      <AddStakeDialog
        slpxPair={glmrSlpxPair}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            return sp
          })
        }
      />
    )
  }

  return null
}

export default () => (
  <PolkadotApiIdProvider id="wss://hk.p.bifrost-rpc.liebi.com/ws">
    <StakeDialog />
  </PolkadotApiIdProvider>
)
