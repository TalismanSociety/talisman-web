import { FloatingPortal as BaseFloatingPortal } from '@floating-ui/react'
import { useCallback, useState, type RefCallback } from 'react'

const FloatingPortal = (props: Exclude<Parameters<typeof BaseFloatingPortal>['0'], 'root'>) => {
  const [root, setRoot] = useState<Element>(document.body)

  return (
    <>
      <div
        ref={useCallback<RefCallback<HTMLDivElement>>(
          element =>
            setRoot(
              Array.from(document.querySelectorAll('dialog[open]'))
                .filter(x => x.contains(element))
                .at(-1) ?? document.body
            ),
          []
        )}
        css={{ display: 'none' }}
      />
      <BaseFloatingPortal {...props} root={root as HTMLElement} />
    </>
  )
}

export default FloatingPortal
