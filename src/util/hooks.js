import { 
  useState,
  useCallback
} from 'react'

export const useBoolean = init => {
  const [value, setValue] = useState(init||false);
  const toggle = useCallback(() => setValue(!value), [value]);
  return [value, toggle];
}
