// @ts-nocheck

import { TypeRegistry } from '@polkadot/types'

const registry = new TypeRegistry()

export function getNativeLocation() {
  return registry.createType('MultiLocation', {
    parents: 1,
    interior: {
      here: null,
    },
  })
}

export function getAssetLocation(id: string, palletInstance?: number) {
  return registry.createType('MultiLocation', {
    parents: 0,
    interior: {
      x2: [{ palletInstance: palletInstance }, { generalIndex: id }],
    },
  })
}
