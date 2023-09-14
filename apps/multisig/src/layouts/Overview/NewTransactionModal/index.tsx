import Modal from '@components/Modal'
import { List, Send, Share2, X } from '@talismn/icons'
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

const actionsMetadata: Record<Action, { name: string; icon: React.ReactElement }> = {
  [Action.Send]: {
    name: 'Send',
    icon: <Send size={20} />,
  },
  [Action.Advanced]: {
    name: 'Advanced',
    icon: <List size={20} />,
  },
  [Action.MultiSend]: {
    name: 'Multi-send',
    icon: <Share2 size={20} />,
  },
}

const NewTransactionModal = () => {
  const location = useLocation().pathname
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | undefined>(undefined)
  const isOpen = location.startsWith('/overview/new-transaction')
  const close = () => {
    navigate('/overview')
  }

  const selectedActionMetadata = action !== undefined ? actionsMetadata[action] : undefined
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
      <div css={{ padding: '32px 32px 80px', position: 'relative' }}>
        {selectedActionMetadata !== undefined && (
          <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
            <p css={{ fontSize: '18px', marginTop: '4px' }}>{selectedActionMetadata.name}</p>
            {selectedActionMetadata.icon}
          </div>
        )}
        <IconButton css={{ position: 'absolute', right: '32px', top: '32px' }} onClick={close}>
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
