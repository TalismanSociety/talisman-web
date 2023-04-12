import { FloatingPortal as BaseFloatingPortal } from '@floating-ui/react'
import { useMemo, useRef } from 'react'

const FloatingPortal = (props: Exclude<Parameters<typeof BaseFloatingPortal>['0'], 'root'>) => {
  const dummyRef = useRef<HTMLDivElement>(null)

  const openDialogs = document.querySelectorAll('dialog[open]')
  const topMostDialog: Element | null = openDialogs.item(openDialogs.length - 1)

  const root = useMemo(
    () => (topMostDialog?.contains(dummyRef.current) ? topMostDialog : document.body),
    [dummyRef.current, topMostDialog]
  )

  return (
    <>
      <div ref={dummyRef} css={{ display: 'none' }} />
      <BaseFloatingPortal {...props} root={root as any} />
    </>
  )
}

export default FloatingPortal
