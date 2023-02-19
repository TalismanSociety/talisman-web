import { AtomEffect } from 'recoil'

export const storageEffect =
  <T>(storage: Storage, key?: string): AtomEffect<T> =>
  ({ node, setSelf, onSet }) => {
    const storageKey = key ?? node.key
    const savedValue = storage.getItem(node.key)

    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue))
    }

    onSet((newValue, _, isReset) => {
      isReset ? storage.removeItem(storageKey) : storage.setItem(storageKey, JSON.stringify(newValue))
    })
  }
