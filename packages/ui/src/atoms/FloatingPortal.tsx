import { FloatingPortal as BaseFloatingPortal } from '@floating-ui/react'

const FloatingPortal = (props: Exclude<Parameters<typeof BaseFloatingPortal>['0'], 'root'>) => {
  const openDialogs = document.querySelectorAll('dialog[open]')
  return (
    <BaseFloatingPortal {...props} root={(openDialogs.item(openDialogs.length - 1) as any) ?? (document.body as any)} />
  )
}

export default FloatingPortal
