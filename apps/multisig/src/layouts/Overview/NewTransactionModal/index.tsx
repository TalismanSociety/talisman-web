import { css } from '@emotion/css'
import Modal from 'react-modal'
import { useLocation, useNavigate } from 'react-router-dom'

const ModalContent = () => {
  return (
    <div
      className={css`
        display: grid;
        padding: 80px;
      `}
    >
      hello im contentttttt
    </div>
  )
}

const NewTransactionModal = () => {
  Modal.setAppElement('#root')
  const location = useLocation().pathname
  const navigate = useNavigate()
  const isOpen = location.startsWith('/overview/new-transaction')

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={() => {
        navigate('/overview')
      }}
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
        },
        content: {
          position: 'absolute',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: '0',
          background: 'var(--color-background)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '32px',
          outline: 'none',
          padding: '0',
          height: '653px',
          width: 'calc(100% - 24px)',
          maxWidth: '1024px',
        },
      }}
      contentLabel="Example Modal"
      closeTimeoutMS={150}
    >
      <ModalContent />
    </Modal>
  )
}

export default NewTransactionModal
