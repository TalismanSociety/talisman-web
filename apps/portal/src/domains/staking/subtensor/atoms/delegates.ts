import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const DELEGATES_URL = 'https://raw.githubusercontent.com/opentensor/bittensor-delegates/main/public/delegates.json'

// Openτensor Foundaτion
export const DEFAULT_DELEGATE = '5F4tQyWrhfGVcNhoqeiNsR6KjD4wMZ2kfhLj4oHYuyHbZAc3'
export const MIN_SUBTENSOR_STAKE = 0.1

export type Delegates = Record<string, Delegate>
export type Delegate = {
  address: string
  name: string
  url?: string
  description?: string
  signature?: string
}

export const delegatesAtom = atom(async () => {
  try {
    const response = await (await fetch(DELEGATES_URL)).json()
    return safeParseDelegates(response)
  } catch (cause) {
    throw new Error('Failed to fetch TAO delegates', { cause })
  }
})

export const delegateAtomFamily = atomFamily((address: string | undefined) => {
  if (!address) return atom(() => Promise.resolve(undefined))

  return atom(async get => (await get(delegatesAtom))[address])
})

const safeParseDelegates = (response: unknown): Delegates => {
  if (typeof response !== 'object') return {}
  if (response === null) return {}
  if (Object.keys(response).length === 0) return {}

  const delegates = Object.entries(response)
    .flatMap(([address, props]: [string, unknown]): Delegate | never[] => {
      if (typeof address !== 'string' || address.length == 0) return []
      if (typeof props !== 'object' || props === null) return []
      if (!('name' in props) || typeof props.name !== 'string' || props.name.length === 0) return []

      const url = (() => {
        if (!('url' in props)) return
        if (typeof props.url !== 'string') return
        if (props.url.length === 0) return
        if (!props.url.startsWith('https://')) return `https://${props.url}`
        return props.url
      })()

      return { ...props, address, name: props.name, url }
    })
    .sort(sortDefaultDelegateFirst)

  return Object.fromEntries(delegates.map(d => [d.address, d]))
}

const sortDefaultDelegateFirst = (a: Delegate, b: Delegate) =>
  a.address === b.address ? 0 : a.address === DEFAULT_DELEGATE ? -1 : b.address === DEFAULT_DELEGATE ? 1 : 0
