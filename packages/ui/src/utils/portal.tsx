import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
} from 'react'

export const createPortal = () => {
  const Context = createContext<{
    element: ReactNode
    addElement: (element: ReactNode) => void
    removeElement: (element: ReactNode) => void
  }>({ element: undefined, addElement: () => {}, removeElement: () => {} })

  const Provider = (props: PropsWithChildren) => {
    const [elements, setElements] = useState<ReactNode[]>([])

    return (
      <Context.Provider
        value={{
          element: elements.at(-1),
          addElement: useCallback(element => setElements(x => [...x.filter(y => y !== element), element]), []),
          removeElement: useCallback(element => setElements(x => x.filter(y => y !== element)), []),
        }}
      >
        {props.children}
      </Context.Provider>
    )
  }

  const Portal = (props: PropsWithChildren) => {
    const { addElement, removeElement } = useContext(Context)

    // Need to wrap children in a React component to do referential equality check
    // as children can also be primitive like number, string, etc
    const wrappedElement = useMemo(() => <>{props.children}</>, [props.children])

    useEffect(() => {
      addElement(wrappedElement)

      return () => removeElement(wrappedElement)
    }, [addElement, removeElement, wrappedElement])

    return null
  }

  const Element = () => <>{useContext(Context).element}</>

  return [Provider, Portal, Element] as const
}
