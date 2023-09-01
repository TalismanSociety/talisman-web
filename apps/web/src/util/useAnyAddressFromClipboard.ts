import { encodeAnyAddress } from '@talismn/util'
import { useEffect, useState } from 'react'

export enum SS58Format {
  Polkadot = 0,
  Kusama = 2,
}

export type AnyAddress = string | Uint8Array

export function convertAnyAddress(address: AnyAddress, ss58format: SS58Format) {
  if (!address) {
    return address
  }
  try {
    const encodedAddress = encodeAnyAddress(address, ss58format)
    return encodedAddress
  } catch (err) {
    console.error(`>>> ERROR(convertAnyAddress):`, err)
    return address
  }
}

// TODO: Maybe deprecate this as we don't really want to influence the "pasted" value.
export function useAnyAddressFromClipboard(ss58format: SS58Format | number) {
  const [address, setAddress] = useState<AnyAddress>('')
  const [originalAddress, setOriginalAddress] = useState<AnyAddress>('')

  async function getClipboardData(e: ClipboardEvent) {
    let text = ''
    try {
      text = navigator.clipboard ? await navigator.clipboard.readText() : e?.clipboardData?.getData('text/plain') ?? ''
      setOriginalAddress(text)
    } catch (err) {
      // NOTE: This is not supported on Firefox, so just returning as-is
      console.error(`>>> ERROR(getClipboardData):`, err)
      return
    }

    try {
      const encodedAddress = convertAnyAddress(text, ss58format)
      setAddress(encodedAddress)
      e.preventDefault()
    } catch (err) {
      console.error(`>>> ERROR(useAnyAddressFromClipboard):`, err)
      setAddress(text)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    document.addEventListener('paste', getClipboardData)
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      document.removeEventListener('paste', getClipboardData)
    }
  })

  return { address, originalAddress }
}
