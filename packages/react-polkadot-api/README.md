# react-polkadot-api

## Example

```tsx
import {
  PolkadotApiIdProvider,
  PolkadotApiProvider,
  queryAtomFamily,
  queryMultiAtomFamily,
  useDeriveState,
  useQueryMultiState,
  useQueryState,
} from '@talismn/react-polkadot-api'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

const { queryState, deriveState } = queryAtomFamily({ key: 'Query', getApi: id => somePolkadotApiStore.get(id) })

const queryMultiState = queryMultiAtomFamily({ key: 'QueryMulti', getApi: id => somePolkadotApiStore.get(id) })

const App = () => (
  <PolkadotApiProvider
    // Optionally provide API ID at top level
    // if your app only support interacting with one chain at a time
    // this ID will be pass to get `getApi` method above to fetch or create
    // instance of ApiPromise from your own custom store
    apiId={'string | number | symbol'}
    queryState={queryState}
    deriveState={deriveState}
    queryMultiState={queryMultiState}
  >
    {/* Or provide multiple chain IDs for multichain support */}
    <PolkadotApiIdProvider id="chain-1-id">
      <WrapperComponent />
    </PolkadotApiIdProvider>
    {/* Number ID also works */}
    <PolkadotApiIdProvider id={2}>
      <WrapperComponent />
    </PolkadotApiIdProvider>
  </PolkadotApiProvider>
)

// Fully compatible with React suspense
const WrapperComponent = () => (
  <ErrorBoundary>
    <Suspense fallback="Getting data from chain....">
      <ChainReadComponent />
    </Suspense>
  </ErrorBoundary>
)

// Everything is fully type safe with auto completion
const ChainReadComponent = () => {
  const bonded = useRecoilValue(useQueryState('staking', 'bonded', ['someAddress']))
  const bondeds = useRecoilValue(useQueryState('staking', 'bonded.multi', ['someAddress', 'someOtherAddress']))
  const accountInfo = useRecoilValue(useDeriveState('accounts', 'info', ['someAddress']))
  const [maxPoolMembers, erasStakers] = useRecoilValue(
    useQueryMultiState(['nominationPools.maxPoolMembers', ['staking.erasStakers', 1]])
  )

  console.log(bonded, bondeds, accountInfo, maxPoolMembers, erasStakers)

  return null
}
```
