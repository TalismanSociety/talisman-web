import { FloatingPortal as BaseFloatingPortal } from '@floating-ui/react'
import { useLayoutEffect, useState } from 'react'

const FloatingPortal = (props: Exclude<Parameters<typeof BaseFloatingPortal>['0'], 'root'>) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [root, setRoot] = useState<Element>(document.body)

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
      <BaseFloatingPortal {...props} root={root as HTMLElement} />
    </>
  )
}

export default FloatingPortal
