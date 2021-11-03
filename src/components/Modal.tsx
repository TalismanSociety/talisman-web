import { ReactComponent as IconClose } from '@icons/x.svg'
import useKeyDown from '@util/useKeyDown'
import { AnimatePresence, motion } from 'framer-motion'
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

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

type ProviderProps = {}
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

export const Modal = styled(function Modal({ className, closable }) {
  const { open, content, closeModal } = useModal()

  useKeyDown(
    'Escape',
    useCallback(() => open && closable && closeModal(), [open, closable, closeModal])
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="modal-click-to-close-background" onClick={closable && closeModal} />
          <div className="modal-content">
            {closable && <IconClose className="close-icon" onClick={closeModal} />}
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9998;

  > .modal-click-to-close-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  > .modal-content {
    width: 100%;
    max-width: 684px;
    margin: 2rem;
    overflow-y: auto;
    background: rgb(${({ theme }) => theme?.background});
    border-radius: 1.6rem;
    padding: 6.4rem 4.6rem 4.6rem 4.6rem;
    z-index: 10000;
    position: relative;

    > .close-icon {
      position: absolute;
      width: 4rem;
      height: 4rem;
      top: 3.2rem;
      right: 3.2rem;
      cursor: pointer;
    }
  }
`

export default Modal
