import { FloatingPortal as BaseFloatingPortal } from '@floating-ui/react'
import { useMemo, useRef } from 'react'

const FloatingPortal = (props: Exclude<Parameters<typeof BaseFloatingPortal>['0'], 'root'>) => {
  const dummyRef = useRef<HTMLDivElement>(null)

  const root = useMemo(
    () =>
      Array.from(document.querySelectorAll('dialog[open]'))
        .filter(x => x.contains(dummyRef.current))
        .at(-1) ?? document.body,
    []
  )

  return (
    <>
      <div ref={dummyRef} css={{ display: 'none' }} />
      <BaseFloatingPortal {...props} root={root as any} />
    </>
  )
}

export default FloatingPortal
