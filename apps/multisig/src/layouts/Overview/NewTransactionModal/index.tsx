import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { List, Send, Share2, X, Zap } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { ReactNode } from 'react'
import Modal from 'react-modal'
import { useLocation, useNavigate } from 'react-router-dom'

const ActionButton = ({
  name,
  description,
  icon,
  disabled,
}: {
  name: string
  description: string
  icon: ReactNode
  disabled?: boolean
}) => {
  const theme = useTheme()
  return (
    <div
      className={css`
        display: grid;
        grid-template-rows: 1fr auto;
        height: 180px;
        cursor: pointer;
        min-width: 300px;
        max-width: 380px;
        padding: 32px;
        border-radius: 16px;
        background: rgba(250, 250, 250, 0.05);
        transition: all 150ms ease-in-out;
        :hover {
          * > h1,
          span,
          svg {
            color: black;
          }
          background: var(--color-offWhite);
        }
      `}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* <span css={{ color: 'var(--color-offWhite)', fontSize: '32px' }}>{name}</span> */}
        <h1>{name}</h1>
        <IconButton size={40} contentColor={`rgb(${theme.offWhite})`}>
          {icon}
        </IconButton>
      </div>
      <span>{description}</span>
    </div>
  )
}

const ModalContent = () => {
  return (
    <div css={{ display: 'grid', justifyContent: 'center', paddingTop: '24px' }}>
      <div
        className={css`
          display: grid;
          justify-items: center;
          max-width: 784px;
        `}
      >
        <span css={{ color: 'var(--color-offWhite)', fontSize: '32px' }}>Select an action</span>
        <div css={{ display: 'grid', gap: '24px', marginTop: '64px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <ActionButton name="Send" description="Transfer funds to a single address" icon={<Send size={33} />} />
          <ActionButton
            name="Multi-send"
            description="Transfer funds to a multiple addresses"
            disabled={true}
            icon={<Share2 size={33} />}
          />
          <ActionButton name="Stake" description="Stake your vaults assets" icon={<Zap size={33} />} disabled={true} />
          <ActionButton name="Advanced" description="Craft a custom transaction" icon={<List size={33} />} />
        </div>
      </div>
    </div>
  )
}

const NewTransactionModal = () => {
  Modal.setAppElement('#root')
  const location = useLocation().pathname
  const navigate = useNavigate()
  const isOpen = location.startsWith('/overview/new-transaction')
  const close = () => {
    navigate('/overview')
  }

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={close}
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
      <div css={{ padding: '32px' }}>
        <IconButton css={{ marginLeft: 'auto' }} onClick={close}>
          <X />
        </IconButton>
        <ModalContent />
      </div>
    </Modal>
  )
}

export default NewTransactionModal
