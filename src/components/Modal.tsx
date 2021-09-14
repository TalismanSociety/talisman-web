import { ReactComponent as IconClose } from '@icons/x.svg'
import useKeyDown from '@util/useKeyDown'
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

type ContextProps = {
  open: boolean
  content: JSX.Element | null
  openModal: (content: JSX.Element) => void
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

  const openModal = useCallback((content: JSX.Element) => setContent(content), [])
  const closeModal = useCallback(() => setContent(null), [])

  const value = useMemo(
    () => ({ open: content !== null, content, openModal, closeModal }),
    [content, openModal, closeModal]
  )

  return (
    <Context.Provider value={value}>
      <Modal />
      {children}
    </Context.Provider>
  )
}

export const Modal = styled(function Modal({ className }) {
  const { open, content, closeModal } = useModal()

  useKeyDown(
    'Escape',
    useCallback(() => open && closeModal(), [open, closeModal])
  )

  if (!open) return null
  return (
    <div className={className}>
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-content">
        <IconClose className="close-icon" onClick={closeModal} />
        {content}
      </div>
    </div>
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
  z-index: 9999;

  > .modal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9999;
  }
  > .modal-content {
    position: relative;
    display: block;
    width: 684px;
    background: rgb(${({ theme }) => theme?.background});
    border-radius: 1.6rem;
    padding: 6.4rem 4.6rem 4.6rem 4.6rem;
    z-index: 10000;

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
