import { chainStorageAtomFamily, chainQueryMultiAtomFamily } from '@talismn/polkadot-api-react'
import { substrateApiState } from '.'

export const chainStorageState = chainStorageAtomFamily({
  getApiPromise: endpoint => substrateApiState(endpoint),
})

export const chainQueryMultiState = chainQueryMultiAtomFamily({
  getApiPromise: endpoint => substrateApiState(endpoint),
})
