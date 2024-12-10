import { queryAtomFamily, queryMultiAtomFamily } from '@talismn/react-polkadot-api'

import { substrateApiState } from '@/domains/common/recoils/api'

export const { queryState: chainQueryState, deriveState: chainDeriveState } = queryAtomFamily({
  key: 'SubstrateQuery',
  getApi: id => {
    if (typeof id !== 'string') {
      throw new Error('Only accept endpoint as ID')
    }

    return substrateApiState(id)
  },
})

export const chainQueryMultiState = queryMultiAtomFamily({
  key: 'SubstrateQueryMulti',
  getApi: id => {
    if (typeof id !== 'string') {
      throw new Error('Only accept endpoint as ID')
    }

    return substrateApiState(id)
  },
})
