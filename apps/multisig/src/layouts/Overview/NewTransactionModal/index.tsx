import Modal from '@components/Modal'
import { X } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ActionsMenu from './ActionsMenu'
import AdvancedAction from './AdvancedAction'
import MultiSendAction from './MultiSendAction'
import SendAction from './SendAction'

export enum Action {
  Send,
  Advanced,
  MultiSend,
}

const NewTransactionModal = () => {
  const location = useLocation().pathname
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | undefined>(undefined)
  const isOpen = location.startsWith('/overview/new-transaction')
  const close = () => {
    navigate('/overview')
  }

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={close}
      onAfterClose={() => {
        setAction(undefined)
      }}
      contentLabel="New Transaction Modal"
    >
      <div css={{ padding: '32px 32px 80px 32px' }}>
        <IconButton css={{ marginLeft: 'auto' }} onClick={close}>
          <X />
        </IconButton>
        {action === undefined ? (
          <ActionsMenu
            onActionClick={(a: Action) => {
              setAction(a)
            }}
          />
        ) : action === Action.Send ? (
          <SendAction onCancel={() => setAction(undefined)} />
        ) : action === Action.Advanced ? (
          <AdvancedAction onCancel={() => setAction(undefined)} />
        ) : action === Action.MultiSend ? (
          <MultiSendAction onCancel={() => setAction(undefined)} />
        ) : null}
      </div>
    </Modal>
  )
}

export default NewTransactionModal
