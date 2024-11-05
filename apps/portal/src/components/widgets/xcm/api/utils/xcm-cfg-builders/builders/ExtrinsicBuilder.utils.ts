// @ts-nocheck

import { SubmittableExtrinsicFunction } from '@polkadot/api/types'
import { getTypeDef } from '@polkadot/types'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'

import { XcmVersion } from './types'

export function getExtrinsicArgumentVersion(
  func?: SubmittableExtrinsicFunction<'promise'>,
  index: number = 0
): XcmVersion {
  if (!func) return XcmVersion.v1

  const { type } = func.meta.args[index]
  const instance = func.meta.registry.createType(type.toString())
  const raw = getTypeDef(instance?.toRawType())

  if (!raw.sub) {
    return XcmVersion.v1
  }

  const versions = Array.isArray(raw.sub) ? raw.sub.map(x => x.name) : [raw.sub.name]

  if (versions.includes(XcmVersion.v3)) {
    return XcmVersion.v3
  }

  if (versions.includes(XcmVersion.v2)) {
    return XcmVersion.v2
  }

  if (versions.includes(XcmVersion.v1)) {
    return XcmVersion.v1
  }

  throw new Error("Can't find Xcm version")
}

export function getExtrinsicAccount(address: string) {
  const isEthAddress = address.length === 42 && address.startsWith('0x')

  return isEthAddress
    ? {
        AccountKey20: {
          key: address,
        },
      }
    : {
        AccountId32: {
          id: u8aToHex(decodeAddress(address)),
          network: null,
        },
      }
}
