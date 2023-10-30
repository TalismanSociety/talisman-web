import { ReactNode } from 'react'
import ReactModal, { Props as ReactModalProps } from 'react-modal'

interface Props extends ReactModalProps {
  children: ReactNode
  width?: string | number
  maxWidth?: string | number
  maxHeight?: string | number
  borderRadius?: number
}

const Modal = (props: Props) => {
  ReactModal.setAppElement('#root')
  return (
    <ReactModal
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          padding: 12,
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: '0',
          background: 'var(--color-background)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: props.borderRadius ?? 16,
          outline: 'none',
          padding: '24px 24px 32px',
          width: props.width ?? 'auto',
          maxWidth: props.maxWidth ?? 1024,
          maxHeight: props.maxHeight ?? 'calc(100vh - 48px)',
          minHeight: 120,
        },
      }}
      closeTimeoutMS={150}
      {...props}
    >
      <div>{props.children}</div>
    </ReactModal>
  )
}

export default Modal
