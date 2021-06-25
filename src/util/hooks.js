import { 
  useState,
  useCallback,
  useMemo
} from 'react'

export const useBoolean = init => {
  const [value, setValue] = useState(init||false);
  const toggle = useCallback(() => setValue(!value), [value]);
  return [value, toggle];
}

export const useSet = (initialSet = []) => {
  const [_set, setSet] = useState(new Set(initialSet))

  const actions = useMemo(() => {
    return {
      set: (items = []) => setSet(new Set(items)),
      add: item => setSet(state => new Set([...Array.from(state), item])),
      remove: item => setSet(state => new Set(Array.from(state).filter((i) => i !== item))),
      clear: () => setSet(new Set()),
      reset: () => setSet(new Set([...initialSet])),
      contains: item => _set.has(item)
    }
  }, [setSet]) // eslint-disable-line

  return [
    Array.from(_set),
    actions
  ]
}
