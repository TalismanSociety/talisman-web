// TODO: remove legacy modal completely

import { AlertDialog } from '@talismn/ui'
import useKeyDown from '@util/useKeyDown'
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react'

type OpenModalOptions = {
  closable: boolean
}

type ContextProps = {
  open: boolean
  content: JSX.Element | null
  openModal: (content: JSX.Element, options?: OpenModalOptions) => void
  closeModal: () => void
}

const Context = createContext<ContextProps | null>(null)
export function useModal(): ContextProps {
  const context = useContext(Context)
  if (!context) throw new Error('The modal provider is required in order to use this hook')

  return context
}

type ProviderProps = PropsWithChildren
export function Provider({ children }: PropsWithChildren<ProviderProps>): JSX.Element {
  const [content, setContent] = useState<JSX.Element | null>(null)
  const [closable, setClosable] = useState(true)

  const openModal = useCallback((content: JSX.Element, options?: OpenModalOptions) => {
    setContent(content)
    setClosable(options?.closable !== false)
  }, [])
  const closeModal = useCallback(() => setContent(null), [])

  const value = useMemo(
    () => ({ open: content !== null, content, openModal, closeModal }),
    [content, openModal, closeModal]
  )

  return (
    <Context.Provider value={value}>
      <Modal closable={closable} />
      {children}
    </Context.Provider>
  )
}

export const Modal = function Modal({ className, closable }: { className?: string; closable: boolean }) {
  const { open, content, closeModal } = useModal()

  useKeyDown(
    'Escape',
    useCallback(() => {
      open && closable && closeModal()
    }, [open, closable, closeModal])
  )

  return <AlertDialog open={open} className={className} onRequestDismiss={closeModal} content={content} />
}

export default Modal
