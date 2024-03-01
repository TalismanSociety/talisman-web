import { useLayoutEffect, useState, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

const FloatingPortal = (props: PropsWithChildren & { id?: string }) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [root, setRoot] = useState<Element>()

  useLayoutEffect(
    () =>
      setRoot(
        Array.from(document.querySelectorAll('dialog'))
          .filter(x => x.contains(element))
          .at(-1) ?? document.body
      ),
    [element]
  )

  return (
    <>
      <div ref={setElement} css={{ display: 'none' }} />
      {root && createPortal(props.children, root, props.id)}
    </>
  )
}

export default FloatingPortal
