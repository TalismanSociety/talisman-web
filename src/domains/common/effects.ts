import { AtomEffect } from 'recoil'

export const storageEffect =
  <T>(storage: Storage, keyPrefix: string = ''): AtomEffect<T> =>
  ({ node, setSelf, onSet }) => {
    const key = keyPrefix + node.key
    const savedValue = storage.getItem(node.key)

    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue))
    }

    onSet((newValue, _, isReset) => {
      isReset ? storage.removeItem(key) : storage.setItem(key, JSON.stringify(newValue))
    })
  }
