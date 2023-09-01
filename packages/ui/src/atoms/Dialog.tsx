import { Global } from '@emotion/react'
import React, { useEffect, useState } from 'react'

export type DialogProps = Omit<
  React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>,
  'ref'
> & {
  isModal?: boolean
  /**
   * The content of dialog is unmounted when closed.
   * If you need to make the content available to search engines
   * or render expensive component trees inside your dialog
   * while optimizing for interaction responsiveness
   * it might be a good idea to change this default behavior
   * by enabling the `keepMounted` prop
   */
  keepMounted?: boolean
  onClickBackdrop?: () => unknown
}

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open = true, isModal = true, keepMounted = false, onClickBackdrop, ...props },
  ref
) {
  const [element, setElement] = useState<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (open) {
      if (element?.open === false) {
        if (isModal) {
          element.showModal()
        } else {
          element.show()
        }
      }
    } else {
      if (element?.open) {
        element.close()
      }
    }
  }, [element, isModal, open])

  useEffect(() => {
    const listener = function (this: HTMLDialogElement, event: MouseEvent) {
      if (event.target !== element) {
        return
      }

      const rect = this.getBoundingClientRect()
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        onClickBackdrop?.()
      }
    }

    element?.addEventListener('click', listener)

    return () => element?.removeEventListener('click', listener)
  }, [element, onClickBackdrop])

  if (!open && !keepMounted) {
    return null
  }

  return (
    <>
      {open && <Global styles={{ body: { overflow: 'hidden' } }} />}
      <dialog
        ref={element => {
          if (typeof ref === 'function') {
            ref(element)
          } else if (ref !== null) {
            ref.current = element
          }

          setElement(element)
        }}
        {...props}
      />
    </>
  )
})

export default Dialog
